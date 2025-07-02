'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { RotateCcw, Play } from 'lucide-react'

interface Point {
  x: number
  y: number
  label: number
}

export function SVMSimulator() {
  const [kernelType, setKernelType] = useState('linear')
  const [cParameter, setCParameter] = useState([1])
  const [gamma, setGamma] = useState([1])
  const [dataPoints, setDataPoints] = useState<Point[]>([])
  const [decisionBoundary, setDecisionBoundary] = useState<any[]>([])
  const [isTrained, setIsTrained] = useState(false)
  const [isTraining, setIsTraining] = useState(false)

  const generateData = () => {
    const points: Point[] = []
    
    // Generate two classes with random separation patterns
    const separationType = Math.floor(Math.random() * 3) // 0: linear, 1: circular, 2: diagonal
    
    for (let i = 0; i < 50; i++) {
      if (separationType === 0) {
        // Linear separation
        const x = Math.random() * 8 + 1
        const y = Math.random() * 8 + 1
        const label = x + y > 10 ? 1 : 0
        points.push({ x, y, label })
      } else if (separationType === 1) {
        // Circular separation
        const angle = Math.random() * 2 * Math.PI
        const radius = Math.random() * 3 + (i < 25 ? 1 : 4)
        const centerX = 5
        const centerY = 5
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        const label = i < 25 ? 0 : 1
        points.push({ x: Math.max(0.5, Math.min(9.5, x)), y: Math.max(0.5, Math.min(9.5, y)), label })
      } else {
        // Diagonal separation with noise
        const x = Math.random() * 8 + 1
        const y = Math.random() * 8 + 1
        const noise = (Math.random() - 0.5) * 2
        const label = (y > x + noise) ? 1 : 0
        points.push({ x, y, label })
      }
    }
    
    setDataPoints(points)
    setDecisionBoundary([])
    setIsTrained(false)
    setIsTraining(false)
  }

  const trainSVM = () => {
    if (dataPoints.length === 0) return
    
    setIsTraining(true)
    setIsTrained(false)
    setDecisionBoundary([])
    
    // Simulate training delay
    setTimeout(() => {
      const boundary = []
      
      if (kernelType === 'linear') {
        // Linear decision boundary
        const class0Points = dataPoints.filter(p => p.label === 0)
        const class1Points = dataPoints.filter(p => p.label === 1)
        
        if (class0Points.length > 0 && class1Points.length > 0) {
          // Calculate rough separation line
          const class0Center = {
            x: class0Points.reduce((sum, p) => sum + p.x, 0) / class0Points.length,
            y: class0Points.reduce((sum, p) => sum + p.y, 0) / class0Points.length
          }
          const class1Center = {
            x: class1Points.reduce((sum, p) => sum + p.x, 0) / class1Points.length,
            y: class1Points.reduce((sum, p) => sum + p.y, 0) / class1Points.length
          }
          
          // Create a line perpendicular to the line connecting class centers
          const midX = (class0Center.x + class1Center.x) / 2
          const midY = (class0Center.y + class1Center.y) / 2
          const slope = -(class1Center.x - class0Center.x) / (class1Center.y - class0Center.y + 0.001)
          
          for (let x = 0; x <= 10; x += 0.2) {
            const y = midY + slope * (x - midX)
            if (y >= 0 && y <= 10) {
              boundary.push({ x, y })
            }
          }
        }
      } else {
        // RBF kernel - create a more complex boundary
        for (let x = 0; x <= 10; x += 0.1) {
          for (let y = 0; y <= 10; y += 0.1) {
            let sum = 0
            dataPoints.forEach(point => {
              const distance = Math.exp(-gamma[0] * Math.pow(Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2), 2))
              sum += (point.label === 0 ? -1 : 1) * distance
            })
            
            if (Math.abs(sum) < 0.1) { // Near decision boundary
              boundary.push({ x, y })
            }
          }
        }
      }
      
      setDecisionBoundary(boundary)
      setIsTrained(true)
      setIsTraining(false)
    }, 500)
  }

  const accuracy = useMemo(() => {
    if (!isTrained || dataPoints.length === 0) return 0
    
    // Simple accuracy calculation for demo
    let correct = 0
    dataPoints.forEach(point => {
      const prediction = point.x + point.y > 10 ? 1 : 0
      if (prediction === point.label) correct++
    })
    
    return correct / dataPoints.length
  }, [dataPoints, isTrained])

  const reset = () => {
    setCParameter([1])
    setGamma([1])
    setDataPoints([])
    setDecisionBoundary([])
    setIsTrained(false)
    setIsTraining(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SVM Parameters</CardTitle>
            <CardDescription>Configure Support Vector Machine settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Kernel Type</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={kernelType === 'linear' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setKernelType('linear')}
                >
                  Linear
                </Button>
                <Button
                  variant={kernelType === 'rbf' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setKernelType('rbf')}
                >
                  RBF
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">C Parameter</label>
                <span className="text-sm text-muted-foreground">{cParameter[0].toFixed(2)}</span>
              </div>
              <Slider
                value={cParameter}
                onValueChange={setCParameter}
                max={10}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>

            {kernelType === 'rbf' && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Gamma</label>
                  <span className="text-sm text-muted-foreground">{gamma[0].toFixed(2)}</span>
                </div>
                <Slider
                  value={gamma}
                  onValueChange={setGamma}
                  max={5}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}

            <div className="space-y-2">
              <Button onClick={generateData} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Generate Data
              </Button>
                             <Button onClick={trainSVM} className="w-full" disabled={dataPoints.length === 0 || isTraining}>
                 <Play className="w-4 h-4 mr-2" />
                 {isTraining ? 'Training...' : 'Train SVM'}
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
            <CardTitle className="text-lg">Decision Boundary</CardTitle>
            <CardDescription>Data points and SVM decision boundary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[400px] bg-muted/30 rounded-lg border graph-visualization">
              <svg width="100%" height="100%" viewBox="0 0 400 400" className="svg-graph">
                                 {/* Decision boundary */}
                 {decisionBoundary.length > 0 && (
                   <>
                     {kernelType === 'linear' ? (
                       <path
                         d={`M ${decisionBoundary.map(p => `${p.x * 35 + 30},${p.y * 35 + 30}`).join(' L ')}`}
                         stroke="hsl(var(--primary))"
                         strokeWidth="3"
                         fill="none"
                         strokeDasharray="5,5"
                       />
                     ) : (
                       decisionBoundary.map((point, index) => (
                         <circle
                           key={index}
                           cx={point.x * 35 + 30}
                           cy={point.y * 35 + 30}
                           r="1"
                           fill="hsl(var(--primary))"
                           opacity="0.6"
                         />
                       ))
                     )}
                   </>
                 )}
                
                {/* Data points */}
                {dataPoints.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x * 35 + 30}
                    cy={point.y * 35 + 30}
                    r="4"
                    fill={point.label === 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}
                    stroke="hsl(var(--background))"
                    strokeWidth="2"
                  />
                ))}
                
                {/* Legend */}
                <g transform="translate(320, 20)">
                  <circle cx="10" cy="10" r="4" fill="hsl(var(--primary))" />
                  <text x="20" y="15" fontSize="12" className="fill-muted-foreground">Class 0</text>
                  <circle cx="10" cy="30" r="4" fill="hsl(var(--destructive))" />
                  <text x="20" y="35" fontSize="12" className="fill-muted-foreground">Class 1</text>
                  {isTrained && (
                    <>
                      <line x1="5" y1="50" x2="15" y2="50" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="2,2" />
                      <text x="20" y="55" fontSize="12" className="fill-muted-foreground">Boundary</text>
                    </>
                  )}
                </g>
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      {isTrained && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Model Performance</CardTitle>
            <CardDescription>Evaluation metrics for the trained SVM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {(accuracy * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{cParameter[0].toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">C Parameter</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{kernelType.toUpperCase()}</div>
                <div className="text-sm text-muted-foreground">Kernel Type</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 