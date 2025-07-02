'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { RotateCcw, Play } from 'lucide-react'

export function DecisionTreeSimulator() {
  const [maxDepth, setMaxDepth] = useState([3])
  const [minSamples, setMinSamples] = useState([5])
  const [features, setFeatures] = useState([2])
  const [treeGenerated, setTreeGenerated] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  const generateTree = () => {
    setTreeGenerated(false)
    setTimeout(() => {
      setTreeGenerated(true)
    }, 100)
  }

  const reset = () => {
    setMaxDepth([3])
    setMinSamples([5])
    setFeatures([2])
    setTreeGenerated(false)
    setZoomLevel(1)
  }

  const renderTreeNode = (depth: number, nodeId: string, x: number = 0, y: number = 0, isLeaf: boolean = false) => {
    if (depth > maxDepth[0]) return null

    const featureNum = Math.floor(Math.random() * features[0]) + 1
    const threshold = Math.random().toFixed(2)
    const classLabel = Math.random() > 0.5 ? 'A' : 'B'
    const leafColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))']
    const nodeColor = 'hsl(var(--primary))'

    const nodeWidth = 80
    const nodeHeight = 40
    const levelHeight = 80
    const siblingSpacing = Math.max(100, 200 / (depth + 1))

    return (
      <g key={nodeId}>
        {/* Node rectangle */}
        <rect
          x={x - nodeWidth/2}
          y={y - nodeHeight/2}
          width={nodeWidth}
          height={nodeHeight}
          rx={8}
          fill={isLeaf ? leafColors[classLabel === 'A' ? 0 : 1] : nodeColor}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        
        {/* Node text */}
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          className="text-xs font-medium fill-background"
        >
          {isLeaf ? `Class ${classLabel}` : `X${featureNum} ≤ ${threshold}`}
        </text>

        {/* Child nodes and connections */}
        {!isLeaf && depth < maxDepth[0] && (
          <>
            {/* Left child */}
            {(() => {
              const leftX = x - siblingSpacing
              const leftY = y + levelHeight
              return (
                <>
                  {/* Connection line */}
                  <line
                    x1={x}
                    y1={y + nodeHeight/2}
                    x2={leftX}
                    y2={leftY - nodeHeight/2}
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="2"
                    className="opacity-60"
                  />
                  {/* Branch label */}
                  <text
                    x={(x + leftX) / 2 - 10}
                    y={(y + leftY) / 2}
                    className="text-xs fill-muted-foreground font-medium"
                  >
                    Yes
                  </text>
                  {renderTreeNode(depth + 1, `${nodeId}-left`, leftX, leftY, depth + 1 >= maxDepth[0])}
                </>
              )
            })()}

            {/* Right child */}
            {(() => {
              const rightX = x + siblingSpacing
              const rightY = y + levelHeight
              return (
                <>
                  {/* Connection line */}
                  <line
                    x1={x}
                    y1={y + nodeHeight/2}
                    x2={rightX}
                    y2={rightY - nodeHeight/2}
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="2"
                    className="opacity-60"
                  />
                  {/* Branch label */}
                  <text
                    x={(x + rightX) / 2 + 10}
                    y={(y + rightY) / 2}
                    className="text-xs fill-muted-foreground font-medium"
                  >
                    No
                  </text>
                  {renderTreeNode(depth + 1, `${nodeId}-right`, rightX, rightY, depth + 1 >= maxDepth[0])}
                </>
              )
            })()}
          </>
        )}
      </g>
    )
  }

  const treeWidth = Math.max(400, 150 * Math.pow(2, maxDepth[0] - 1))
  const treeHeight = Math.max(300, 100 + maxDepth[0] * 80)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tree Parameters</CardTitle>
            <CardDescription>Configure the decision tree structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Max Depth</label>
                <span className="text-sm text-muted-foreground">{maxDepth[0]}</span>
              </div>
              <Slider
                value={maxDepth}
                onValueChange={setMaxDepth}
                max={6}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Min Samples per Leaf</label>
                <span className="text-sm text-muted-foreground">{minSamples[0]}</span>
              </div>
              <Slider
                value={minSamples}
                onValueChange={setMinSamples}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Number of Features</label>
                <span className="text-sm text-muted-foreground">{features[0]}</span>
              </div>
              <Slider
                value={features}
                onValueChange={setFeatures}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={generateTree} className="flex-1">
                <Play className="w-4 h-4 mr-2" />
                Generate Tree
              </Button>
              <Button onClick={reset} variant="outline">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tree Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Decision Tree Structure</CardTitle>
              <CardDescription>Visual representation of the decision tree</CardDescription>
            </div>
            {treeGenerated && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                >
                  Zoom Out
                </Button>
                <span className="text-sm self-center px-2">{Math.round(zoomLevel * 100)}%</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.25))}
                >
                  Zoom In
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="w-full h-[400px] overflow-auto border rounded-lg bg-muted/20">
              {treeGenerated ? (
                <div 
                  className="flex justify-center items-start p-4"
                  style={{ 
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top center',
                    minHeight: `${Math.max(400, treeHeight * zoomLevel)}px`,
                    minWidth: `${Math.max(400, treeWidth * zoomLevel)}px`
                  }}
                >
                  <svg 
                    width={treeWidth} 
                    height={treeHeight}
                    viewBox={`0 0 ${treeWidth} ${treeHeight}`}
                    className="overflow-visible"
                  >
                    {renderTreeNode(0, 'root', treeWidth/2, 50)}
                  </svg>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <div>
                    <div className="text-lg mb-2">Generate a tree to see the structure</div>
                    <div className="text-sm">Adjust parameters and click "Generate Tree"</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      {treeGenerated && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tree Statistics</CardTitle>
            <CardDescription>Information about the generated decision tree</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{maxDepth[0]}</div>
                <div className="text-sm text-muted-foreground">Max Depth</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{Math.pow(2, maxDepth[0])}</div>
                <div className="text-sm text-muted-foreground">Leaf Nodes</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{Math.pow(2, maxDepth[0] + 1) - 1}</div>
                <div className="text-sm text-muted-foreground">Total Nodes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 