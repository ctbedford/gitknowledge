# Knowledge Cathedral 🏛️

A living repository of interconnected thoughts, built with Next.js 14, TypeScript, and MDX.

## Features

- 🌱 **Growth Stages**: Ideas evolve from seeds to forests
- 🔗 **Bidirectional Linking**: Automatic backlink discovery
- 📊 **Knowledge Graph**: Visual exploration of connections
- 🔍 **Full-Text Search**: Find any thought instantly
- 📱 **Responsive Design**: Beautiful on all devices
- 🎯 **Git-Backed**: Complete version history
- 🔒 **Privacy Controls**: Public, unlisted, and private nodes

## Quick Start

```bash
# Run development server
npm run dev

# Create a new node
echo "# My Thought" > content/my-thought.md

# Build for production
npm run build
```

## Structure

```
knowledge-cathedral/
├── content/          # Your markdown files
├── src/
│   ├── app/         # Next.js app router
│   ├── components/  # React components
│   └── lib/         # Core logic
└── .content-git/    # Git history for content
```

## Creating Content

Create a new `.md` file in the `content/` directory:

```markdown
---
title: My New Thought
stage: seed
certainty: 0.7
importance: 3
visibility: public
tags: [topic1, topic2]
---

# My New Thought

Content with [[wiki links]] and regular [markdown links](/path).
```

Built with ❤️ using STORYMORPH-C
