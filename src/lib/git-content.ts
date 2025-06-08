import git from 'isomorphic-git'
import fs from 'fs'
import path from 'path'
import http from 'isomorphic-git/http/node'

const CONTENT_PATH = path.join(process.cwd(), 'content')
const GIT_DIR = path.join(CONTENT_PATH, '.git')

// Since content is a submodule, we work within its own git directory
export async function initContentRepo() {
  try {
    // Check if git is already initialized (it should be as a submodule)
    const gitExists = await fs.promises.access(GIT_DIR).then(() => true).catch(() => false)
    
    if (!gitExists) {
      await git.init({
        fs,
        dir: CONTENT_PATH,
        defaultBranch: 'main'
      })
      console.log('Content git repository initialized')
    } else {
      console.log('Content git repository already exists')
    }
  } catch (error) {
    console.error('Git init error:', error)
  }
}

// Commit changes to a node
export async function commitNodeChange(
  slug: string,
  message: string,
  author: { name: string; email: string } = { 
    name: 'Knowledge Cathedral', 
    email: 'system@cathedral.local' 
  }
) {
  try {
    const filePath = `${slug}.md`
    
    // Stage the file
    await git.add({
      fs,
      dir: CONTENT_PATH,
      filepath: filePath
    })
    
    // Commit
    const sha = await git.commit({
      fs,
      dir: CONTENT_PATH,
      message,
      author: {
        name: author.name,
        email: author.email,
        timestamp: Math.floor(Date.now() / 1000)
      }
    })
    
    return sha
  } catch (error) {
    console.error('Git commit error:', error)
    throw error
  }
}

// Get history for a node
export interface NodeHistory {
  sha: string
  message: string
  author: string
  email: string
  timestamp: number
  date: Date
}

export async function getNodeHistory(slug: string, limit: number = 10): Promise<NodeHistory[]> {
  try {
    const filePath = `${slug}.md`
    
    // Get log for specific file
    const commits = await git.log({
      fs,
      dir: CONTENT_PATH,
      ref: 'HEAD',
      filepaths: [filePath],
      depth: limit
    })
    
    return commits.map(commit => ({
      sha: commit.oid,
      message: commit.commit.message,
      author: commit.commit.author.name,
      email: commit.commit.author.email,
      timestamp: commit.commit.author.timestamp,
      date: new Date(commit.commit.author.timestamp * 1000)
    }))
  } catch (error) {
    console.error('Git log error:', error)
    return []
  }
}

// Get all commit history
export async function getAllHistory(limit: number = 50): Promise<NodeHistory[]> {
  try {
    const commits = await git.log({
      fs,
      dir: CONTENT_PATH,
      ref: 'HEAD',
      depth: limit
    })
    
    return commits.map(commit => ({
      sha: commit.oid,
      message: commit.commit.message,
      author: commit.commit.author.name,
      email: commit.commit.author.email,
      timestamp: commit.commit.author.timestamp,
      date: new Date(commit.commit.author.timestamp * 1000)
    }))
  } catch (error) {
    console.error('Git log error:', error)
    return []
  }
}

// Get content at specific version
export async function getNodeAtVersion(slug: string, sha: string): Promise<string | null> {
  try {
    const filePath = `${slug}.md`
    
    // Read blob at specific commit
    const { blob } = await git.readBlob({
      fs,
      dir: CONTENT_PATH,
      oid: sha,
      filepath: filePath
    })
    
    return new TextDecoder().decode(blob)
  } catch (error) {
    console.error('Git read blob error:', error)
    return null
  }
}

// Compare two versions
export interface VersionDiff {
  additions: number
  deletions: number
  changes: Array<{
    type: 'add' | 'delete' | 'modify'
    lineNumber: number
    content: string
  }>
}

export async function compareVersions(
  slug: string, 
  sha1: string, 
  sha2: string
): Promise<VersionDiff> {
  try {
    const [content1, content2] = await Promise.all([
      getNodeAtVersion(slug, sha1),
      getNodeAtVersion(slug, sha2)
    ])
    
    if (!content1 || !content2) {
      throw new Error('Could not retrieve versions')
    }
    
    const lines1 = content1.split('\n')
    const lines2 = content2.split('\n')
    
    const changes: VersionDiff['changes'] = []
    let additions = 0
    let deletions = 0
    
    // Simple line-by-line diff
    const maxLines = Math.max(lines1.length, lines2.length)
    
    for (let i = 0; i < maxLines; i++) {
      if (i >= lines1.length) {
        additions++
        changes.push({
          type: 'add',
          lineNumber: i + 1,
          content: lines2[i]
        })
      } else if (i >= lines2.length) {
        deletions++
        changes.push({
          type: 'delete',
          lineNumber: i + 1,
          content: lines1[i]
        })
      } else if (lines1[i] !== lines2[i]) {
        deletions++
        additions++
        changes.push({
          type: 'modify',
          lineNumber: i + 1,
          content: `- ${lines1[i]}\n+ ${lines2[i]}`
        })
      }
    }
    
    return { additions, deletions, changes }
  } catch (error) {
    console.error('Version comparison error:', error)
    return { additions: 0, deletions: 0, changes: [] }
  }
}

// Auto-commit on save
export async function autoCommit(slug: string, content: string) {
  const filePath = path.join(CONTENT_PATH, `${slug}.md`)
  
  // Write file
  await fs.promises.writeFile(filePath, content, 'utf8')
  
  // Generate commit message
  const timestamp = new Date().toISOString()
  const message = `Update ${slug} - ${timestamp}`
  
  // Commit
  await commitNodeChange(slug, message)
}

// Get current branch
export async function getCurrentBranch(): Promise<string> {
  try {
    const branch = await git.currentBranch({
      fs,
      dir: CONTENT_PATH,
      fullname: false
    })
    return branch || 'main'
  } catch (error) {
    return 'main'
  }
}

// Get repository status
export interface GitStatus {
  modified: string[]
  added: string[]
  deleted: string[]
  untracked: string[]
}

export async function getStatus(): Promise<GitStatus> {
  try {
    const FILE = 0, HEAD = 1, WORKDIR = 2
    
    const filenames = await fs.promises.readdir(CONTENT_PATH)
    const status: GitStatus = {
      modified: [],
      added: [],
      deleted: [],
      untracked: []
    }
    
    for (const filename of filenames) {
      if (filename.startsWith('.') || !filename.endsWith('.md')) continue
      
      const filepath = filename
      const fileStatus = await git.status({
        fs,
        dir: CONTENT_PATH,
        filepath
      })
      
      if (fileStatus === 'untracked') {
        status.untracked.push(filepath)
      } else if (fileStatus === 'added') {
        status.added.push(filepath)
      } else if (fileStatus === 'modified') {
        status.modified.push(filepath)
      } else if (fileStatus === 'deleted') {
        status.deleted.push(filepath)
      }
    }
    
    return status
  } catch (error) {
    console.error('Git status error:', error)
    return { modified: [], added: [], deleted: [], untracked: [] }
  }
}