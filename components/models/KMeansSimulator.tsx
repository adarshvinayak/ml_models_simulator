'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { RotateCcw, Play } from 'lucide-react'

interface Point {
  x: number
  y: number
  cluster?: number
}

export function KMeansSimulator() {
  const [numClusters, setNumClusters] = useState([3])
  const [numPoints, setNumPoints] = useState([100])
  const [iterations, setIterations] = useState([10])
  const [dataPoints, setDataPoints] = useState<Point[]>([])
  const [centroids, setCentroids] = useState<Point[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const colors = [
    'hsl(var(--chart-1))', 
    'hsl(var(--chart-2))', 
    'hsl(var(--chart-3))', 
    'hsl(var(--chart-4))', 
    'hsl(var(--chart-5))', 
    'hsl(var(--chart-6))'
  ]

  const generateData = () => {
    const points: Point[] = []
    
    // Generate random clusters with varying positions each time
    const numNaturalClusters = Math.floor(Math.random() * 3) + 2 // 2-4 natural clusters
    
    for (let cluster = 0; cluster < numNaturalClusters; cluster++) {
      const centerX = Math.random() * 6 + 1 // Random center between 1-7
      const centerY = Math.random() * 6 + 1 // Random center between 1-7
      const clusterSize = Math.floor(numPoints[0] / numNaturalClusters)
      const spread = Math.random() * 1.5 + 0.5 // Random spread
      
      for (let i = 0; i < clusterSize; i++) {
        points.push({
          x: centerX + (Math.random() - 0.5) * spread * 2,
          y: centerY + (Math.random() - 0.5) * spread * 2
        })
      }
    }
    
    // Add some random noise points
    const noisePoints = numPoints[0] - points.length
    for (let i = 0; i < noisePoints; i++) {
      points.push({
        x: Math.random() * 8,
        y: Math.random() * 8
      })
    }
    
    setDataPoints(points)
    
    // Initialize random centroids
    const initialCentroids: Point[] = []
    for (let i = 0; i < numClusters[0]; i++) {
      initialCentroids.push({
        x: Math.random() * 8,
        y: Math.random() * 8
      })
    }
    setCentroids(initialCentroids)
  }

  const runKMeans = () => {
    if (dataPoints.length === 0) return
    
    setIsRunning(true)
    let currentCentroids = [...centroids]
    let currentIteration = 0
    
    const iterate = () => {
      // Assign points to clusters
      const updatedPoints = dataPoints.map(point => {
        let minDistance = Infinity
        let closestCluster = 0
        
        currentCentroids.forEach((centroid, index) => {
          const distance = Math.sqrt(
            Math.pow(point.x - centroid.x, 2) + Math.pow(point.y - centroid.y, 2)
          )
          if (distance < minDistance) {
            minDistance = distance
            closestCluster = index
          }
        })
        
        return { ...point, cluster: closestCluster }
      })
      
      setDataPoints(updatedPoints)
      
      // Update centroids
      const newCentroids = currentCentroids.map((_, index) => {
        const clusterPoints = updatedPoints.filter(p => p.cluster === index)
        if (clusterPoints.length === 0) return currentCentroids[index]
        
        const x = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length
        const y = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length
        
        return { x, y }
      })
      
      setCentroids(newCentroids)
      currentCentroids = newCentroids
      currentIteration++
      
      if (currentIteration < iterations[0]) {
        setTimeout(iterate, 500)
      } else {
        setIsRunning(false)
      }
    }
    
    iterate()
  }

  const reset = () => {
    setNumClusters([3])
    setNumPoints([100])
    setIterations([10])
    setDataPoints([])
    setCentroids([])
    setIsRunning(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clustering Parameters</CardTitle>
            <CardDescription>Configure K-Means clustering settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Number of Clusters (k)</label>
                <span className="text-sm text-muted-foreground">{numClusters[0]}</span>
              </div>
              <Slider
                value={numClusters}
                onValueChange={setNumClusters}
                max={6}
                min={2}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Data Points</label>
                <span className="text-sm text-muted-foreground">{numPoints[0]}</span>
              </div>
              <Slider
                value={numPoints}
                onValueChange={setNumPoints}
                max={200}
                min={50}
                step={10}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Max Iterations</label>
                <span className="text-sm text-muted-foreground">{iterations[0]}</span>
              </div>
              <Slider
                value={iterations}
                onValueChange={setIterations}
                max={20}
                min={5}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Button onClick={generateData} className="w-full" disabled={isRunning}>
                <Play className="w-4 h-4 mr-2" />
                Generate Data
              </Button>
              <Button onClick={runKMeans} className="w-full" disabled={isRunning || dataPoints.length === 0}>
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run K-Means'}
              </Button>
              <Button onClick={reset} variant="outline" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Cluster Visualization</CardTitle>
            <CardDescription>Data points and cluster centroids</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[400px] bg-muted/30 rounded-lg border graph-visualization">
              <svg width="100%" height="100%" viewBox="0 0 400 400" className="svg-graph">
                {/* Data points */}
                {dataPoints.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x * 40 + 50}
                    cy={point.y * 40 + 50}
                    r="3"
                    fill={point.cluster !== undefined ? colors[point.cluster] : 'hsl(var(--muted-foreground))'}
                    opacity="0.8"
                  />
                ))}
                
                {/* Centroids */}
                {centroids.map((centroid, index) => (
                  <g key={index}>
                    <circle
                      cx={centroid.x * 40 + 50}
                      cy={centroid.y * 40 + 50}
                      r="8"
                      fill={colors[index]}
                      stroke="hsl(var(--background))"
                      strokeWidth="2"
                    />
                    <text
                      x={centroid.x * 40 + 50}
                      y={centroid.y * 40 + 55}
                      textAnchor="middle"
                      fontSize="10"
                      className="fill-background"
                      fontWeight="bold"
                    >
                      {index + 1}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      {dataPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clustering Statistics</CardTitle>
            <CardDescription>Information about the current clustering</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{numClusters[0]}</div>
                <div className="text-sm text-muted-foreground">Clusters</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{dataPoints.length}</div>
                <div className="text-sm text-muted-foreground">Data Points</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{iterations[0]}</div>
                <div className="text-sm text-muted-foreground">Max Iterations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 