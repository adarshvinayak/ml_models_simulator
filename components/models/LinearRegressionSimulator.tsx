'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { RotateCcw, Play } from 'lucide-react'

interface DataPoint {
  x: number
  y: number
  predicted?: number
}

export function LinearRegressionSimulator() {
  const [slope, setSlope] = useState([1])
  const [intercept, setIntercept] = useState([0])
  const [noiseLevel, setNoiseLevel] = useState([0.5])
  const [numPoints, setNumPoints] = useState([50])
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([])

  // Generate random data points
  const generateData = () => {
    const points: DataPoint[] = []
    // Randomize the true relationship each time
    const trueSlope = (Math.random() - 0.5) * 4 + 2 // Between 0 and 4
    const trueIntercept = (Math.random() - 0.5) * 6 + 3 // Between 0 and 6
    
    for (let i = 0; i < numPoints[0]; i++) {
      const x = Math.random() * 10
      const trueY = trueSlope * x + trueIntercept
      const noise = (Math.random() - 0.5) * noiseLevel[0] * 10
      const y = trueY + noise
      
      points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) })
    }
    
    setDataPoints(points)
  }

  // Calculate predictions and metrics
  const analysisData = useMemo(() => {
    if (dataPoints.length === 0) return { chartData: [], mse: 0, r2: 0 }

    const predictions = dataPoints.map(point => ({
      ...point,
      predicted: slope[0] * point.x + intercept[0]
    }))

    // Calculate Mean Squared Error
    const mse = predictions.reduce((sum, point) => {
      return sum + Math.pow(point.y - point.predicted!, 2)
    }, 0) / predictions.length

    // Calculate R-squared
    const yMean = predictions.reduce((sum, point) => sum + point.y, 0) / predictions.length
    const ssRes = predictions.reduce((sum, point) => sum + Math.pow(point.y - point.predicted!, 2), 0)
    const ssTot = predictions.reduce((sum, point) => sum + Math.pow(point.y - yMean, 2), 0)
    const r2 = 1 - (ssRes / ssTot)

    // Prepare chart data
    const chartData = []
    for (let x = 0; x <= 10; x += 0.5) {
      chartData.push({
        x,
        predicted: slope[0] * x + intercept[0]
      })
    }

    return { chartData, predictions, mse, r2 }
  }, [dataPoints, slope, intercept])

  const reset = () => {
    setSlope([1])
    setIntercept([0])
    setNoiseLevel([0.5])
    setNumPoints([50])
    setDataPoints([])
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Parameters</CardTitle>
            <CardDescription>Adjust the model parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Slope</label>
                <span className="text-sm text-muted-foreground">{slope[0].toFixed(2)}</span>
              </div>
              <Slider
                value={slope}
                onValueChange={setSlope}
                max={5}
                min={-5}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Intercept</label>
                <span className="text-sm text-muted-foreground">{intercept[0].toFixed(2)}</span>
              </div>
              <Slider
                value={intercept}
                onValueChange={setIntercept}
                max={10}
                min={-10}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Noise Level</label>
                <span className="text-sm text-muted-foreground">{noiseLevel[0].toFixed(2)}</span>
              </div>
              <Slider
                value={noiseLevel}
                onValueChange={setNoiseLevel}
                max={2}
                min={0}
                step={0.1}
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
                min={10}
                step={10}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={generateData} className="flex-1">
                <Play className="w-4 h-4 mr-2" />
                Generate Data
              </Button>
              <Button onClick={reset} variant="outline">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Visualization</CardTitle>
            <CardDescription>Data points and regression line</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[400px] bg-muted/30 rounded-lg border graph-visualization">
              <svg width="100%" height="100%" viewBox="0 0 500 400" className="svg-graph">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="50" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Axes */}
                <line x1="50" y1="350" x2="450" y2="350" stroke="hsl(var(--foreground))" strokeWidth="2"/>
                <line x1="50" y1="50" x2="50" y2="350" stroke="hsl(var(--foreground))" strokeWidth="2"/>
                
                {/* Data points */}
                {dataPoints.map((point, index) => (
                  <circle
                    key={index}
                    cx={50 + (point.x * 40)}
                    cy={350 - (point.y * 8)}
                    r="4"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.8}
                    stroke="hsl(var(--background))"
                    strokeWidth="2"
                  />
                ))}
                
                {/* Regression line */}
                {analysisData.chartData.length > 0 && (
                  <path
                    d={`M ${analysisData.chartData.map(p => `${50 + p.x * 40},${350 - p.predicted * 8}`).join(' L ')}`}
                    stroke="hsl(var(--destructive))"
                    strokeWidth="3"
                    fill="none"
                  />
                )}
                
                {/* Axis labels */}
                <text x="250" y="390" textAnchor="middle" className="text-sm fill-muted-foreground">X Values</text>
                <text x="20" y="200" textAnchor="middle" className="text-sm fill-muted-foreground" transform="rotate(-90 20 200)">Y Values</text>
                
                {/* Tick marks and labels */}
                {[0, 2, 4, 6, 8, 10].map(tick => (
                  <g key={tick}>
                    <line x1={50 + tick * 40} y1="350" x2={50 + tick * 40} y2="355" stroke="hsl(var(--foreground))" strokeWidth="1"/>
                    <text x={50 + tick * 40} y="370" textAnchor="middle" className="text-xs fill-muted-foreground">{tick}</text>
                  </g>
                ))}
                
                {[0, 5, 10, 15, 20, 25].map(tick => (
                  <g key={tick}>
                    <line x1="45" y1={350 - tick * 8} x2="50" y2={350 - tick * 8} stroke="hsl(var(--foreground))" strokeWidth="1"/>
                    <text x="40" y={355 - tick * 8} textAnchor="end" className="text-xs fill-muted-foreground">{tick}</text>
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics */}
      {dataPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Model Performance</CardTitle>
            <CardDescription>Evaluation metrics for the current model</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {analysisData.mse.toFixed(3)}
                </div>
                <div className="text-sm text-muted-foreground">Mean Squared Error</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {analysisData.r2.toFixed(3)}
                </div>
                <div className="text-sm text-muted-foreground">R-squared</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 