'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useRouter } from 'next/navigation'

interface GraphNode {
  id: string
  title: string
  stage: string
  importance: number
  certainty: number
}

interface GraphLink {
  source: string
  target: string
  bidirectional: boolean
}

interface KnowledgeGraphProps {
  nodes: GraphNode[]
  links: GraphLink[]
  className?: string
}

export default function KnowledgeGraph({ nodes, links, className = '' }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const router = useRouter()
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  
  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current?.parentElement) {
        const { width } = svgRef.current.parentElement.getBoundingClientRect()
        setDimensions({ width, height: Math.min(600, width * 0.75) })
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return
    
    const { width, height } = dimensions
    
    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove()
    
    // Create SVG with zoom
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
    
    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform.toString())
      })
    
    svg.call(zoom)
    
    // Create container for zoom
    const container = svg.append('g')
    
    // Create arrow markers for directed links
    svg.append('defs').selectAll('marker')
      .data(['end'])
      .enter().append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999')
    
    // Stage colors with opacity based on certainty
    const getNodeColor = (node: GraphNode) => {
      const stageColors: Record<string, string> = {
        seed: '#10b981',
        sapling: '#059669',
        tree: '#047857',
        forest: '#064e3b'
      }
      const color = stageColors[node.stage] || '#10b981'
      return d3.color(color)?.copy({ opacity: 0.3 + (node.certainty * 0.7) }) || color
    }
    
    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => 10 + d.importance * 5))
    
    // Create links
    const link = container.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', (d) => d.bidirectional ? '#3b82f6' : '#9ca3af')
      .attr('stroke-width', (d) => d.bidirectional ? 2 : 1)
      .attr('stroke-dasharray', (d) => d.bidirectional ? 'none' : '5,5')
      .attr('marker-end', (d) => d.bidirectional ? 'none' : 'url(#arrow)')
    
    // Create node groups
    const node = container.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => {
        event.stopPropagation()
        router.push(`/${d.id}`)
      })
      .on('mouseover', function(event, d) {
        setSelectedNode(d.id)
        // Highlight connected nodes
        link.style('opacity', (l: any) => 
          l.source.id === d.id || l.target.id === d.id ? 1 : 0.2
        )
        node.style('opacity', (n: any) => {
          const isConnected = links.some((l: any) => 
            (l.source.id === d.id && l.target.id === n.id) ||
            (l.target.id === d.id && l.source.id === n.id) ||
            n.id === d.id
          )
          return isConnected ? 1 : 0.2
        })
      })
      .on('mouseout', function() {
        setSelectedNode(null)
        link.style('opacity', 1)
        node.style('opacity', 1)
      })
    
    // Add circles to nodes
    node.append('circle')
      .attr('r', (d) => 5 + d.importance * 3)
      .attr('fill', (d) => getNodeColor(d).toString())
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
    
    // Add labels
    node.append('text')
      .text((d) => d.title)
      .attr('x', 12)
      .attr('y', 4)
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
    
    // Add hover effect
    node.select('circle')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d: any) => 8 + d.importance * 3)
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d: any) => 5 + d.importance * 3)
      })
    
    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)
      
      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })
    
    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }
    
    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [nodes, links, router, dimensions])
  
  return (
    <div className={`relative ${className}`}>
      <svg ref={svgRef} className="w-full h-full border rounded-lg bg-gray-50 dark:bg-gray-800" />
      
      {/* Controls */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3">
        <div className="text-sm space-y-1">
          <div className="font-semibold mb-2">Controls</div>
          <div>• Scroll to zoom</div>
          <div>• Drag to pan</div>
          <div>• Click node to visit</div>
          <div>• Hover to see connections</div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3">
        <div className="text-sm space-y-1">
          <div className="font-semibold mb-2">Legend</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Seed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span>Sapling</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-700"></div>
            <span>Tree</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-900"></div>
            <span>Forest</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-8 border-b-2 border-blue-500"></div>
            <span>Bidirectional</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 border-b border-gray-400 border-dashed"></div>
            <span>One-way</span>
          </div>
        </div>
      </div>
      
      {/* Selected node info */}
      {selectedNode && (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 max-w-xs">
          <div className="text-sm">
            <div className="font-semibold">{nodes.find(n => n.id === selectedNode)?.title}</div>
            <div className="text-gray-600 dark:text-gray-400">Click to view →</div>
          </div>
        </div>
      )}
    </div>
  )
}