'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { RotateCcw, Play } from 'lucide-react'

export function NeuralNetworkSimulator() {
  const [hiddenLayers, setHiddenLayers] = useState([2])
  const [neuronsPerLayer, setNeuronsPerLayer] = useState([4])
  const [learningRate, setLearningRate] = useState([0.1])
  const [epochs, setEpochs] = useState([100])
  const [isTraining, setIsTraining] = useState(false)
  const [accuracy, setAccuracy] = useState(0)

  const networkStructure = useMemo(() => {
    const layers = [2] // Input layer
    for (let i = 0; i < hiddenLayers[0]; i++) {
      layers.push(neuronsPerLayer[0])
    }
    layers.push(1) // Output layer
    return layers
  }, [hiddenLayers, neuronsPerLayer])

  const simulateTraining = () => {
    setIsTraining(true)
    setAccuracy(0)
    
    // Generate random initial accuracy and learning curve characteristics
    const initialAccuracy = Math.random() * 0.3 + 0.4 // 0.4-0.7
    const maxAccuracy = Math.random() * 0.2 + 0.8 // 0.8-1.0
    const learningSpeed = learningRate[0] * 2 + Math.random() * 0.5
    const volatility = Math.max(0.02, 0.1 - learningRate[0]) // Higher learning rate = less volatility
    
    let currentEpoch = 0
    const interval = setInterval(() => {
      currentEpoch += 1
      const progress = currentEpoch / epochs[0]
      
      // Simulate realistic learning curve with diminishing returns
      const baseAccuracy = initialAccuracy + (maxAccuracy - initialAccuracy) * (1 - Math.exp(-learningSpeed * progress))
      
      // Add some volatility that decreases over time
      const noise = (Math.random() - 0.5) * volatility * (1 - progress * 0.7)
      const simulatedAccuracy = Math.max(0, Math.min(1, baseAccuracy + noise))
      
      setAccuracy(simulatedAccuracy)
      
      if (currentEpoch >= epochs[0]) {
        clearInterval(interval)
        setIsTraining(false)
      }
    }, Math.max(10, 100 - epochs[0] / 10)) // Faster animation for more epochs
  }

  const reset = () => {
    setHiddenLayers([2])
    setNeuronsPerLayer([4])
    setLearningRate([0.1])
    setEpochs([100])
    setAccuracy(0)
    setIsTraining(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Network Architecture</CardTitle>
            <CardDescription>Configure the neural network structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Hidden Layers</label>
                <span className="text-sm text-muted-foreground">{hiddenLayers[0]}</span>
              </div>
              <Slider
                value={hiddenLayers}
                onValueChange={setHiddenLayers}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Neurons per Layer</label>
                <span className="text-sm text-muted-foreground">{neuronsPerLayer[0]}</span>
              </div>
              <Slider
                value={neuronsPerLayer}
                onValueChange={setNeuronsPerLayer}
                max={10}
                min={2}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Learning Rate</label>
                <span className="text-sm text-muted-foreground">{learningRate[0].toFixed(3)}</span>
              </div>
              <Slider
                value={learningRate}
                onValueChange={setLearningRate}
                max={1}
                min={0.001}
                step={0.001}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Epochs</label>
                <span className="text-sm text-muted-foreground">{epochs[0]}</span>
              </div>
              <Slider
                value={epochs}
                onValueChange={setEpochs}
                max={1000}
                min={10}
                step={10}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={simulateTraining} className="flex-1" disabled={isTraining}>
                <Play className="w-4 h-4 mr-2" />
                {isTraining ? 'Training...' : 'Start Training'}
              </Button>
              <Button onClick={reset} variant="outline">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

                 {/* Network Visualization */}
         <Card>
           <CardHeader>
             <CardTitle className="text-lg">Network Structure</CardTitle>
             <CardDescription>Visual representation of the neural network</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="w-full h-[400px] overflow-auto border rounded-lg bg-muted/30 graph-visualization">
               <div className="flex justify-center items-start p-4" style={{ minWidth: `${Math.max(600, networkStructure.length * 140)}px`, minHeight: '350px' }}>
                 <svg 
                   width={Math.max(600, networkStructure.length * 140)} 
                   height={Math.max(350, Math.max(...networkStructure) * 35 + 100)}
                   className="svg-graph"
                 >
                   {/* Connection lines */}
                   {networkStructure.map((layerSize, layerIndex) => {
                     if (layerIndex === networkStructure.length - 1) return null
                     const nextLayerSize = networkStructure[layerIndex + 1]
                     const layerX = 70 + layerIndex * 140
                     const nextLayerX = 70 + (layerIndex + 1) * 140
                     
                     return Array.from({ length: layerSize }).map((_, neuronIndex) => 
                       Array.from({ length: nextLayerSize }).map((_, nextNeuronIndex) => {
                         const centerY = Math.max(175, Math.max(...networkStructure) * 17.5 + 50)
                         const startY = centerY - (layerSize - 1) * 17.5 + neuronIndex * 35
                         const endY = centerY - (nextLayerSize - 1) * 17.5 + nextNeuronIndex * 35
                         
                         return (
                           <line
                             key={`${layerIndex}-${neuronIndex}-${nextNeuronIndex}`}
                             x1={layerX + 20}
                             y1={startY}
                             x2={nextLayerX - 20}
                             y2={endY}
                             stroke={isTraining ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                             strokeWidth={isTraining ? "2" : "1"}
                             opacity={isTraining ? "0.8" : "0.3"}
                             className={isTraining ? "animate-pulse" : ""}
                           />
                         )
                       })
                     )
                   })}
                   
                   {/* Neurons */}
                   {networkStructure.map((layerSize, layerIndex) => (
                     <g key={layerIndex}>
                       {/* Layer label */}
                       <text
                         x={70 + layerIndex * 140}
                         y={30}
                         textAnchor="middle"
                         className="text-sm fill-muted-foreground font-medium"
                       >
                         {layerIndex === 0 ? 'Input Layer' : 
                          layerIndex === networkStructure.length - 1 ? 'Output Layer' : 
                          `Hidden Layer ${layerIndex}`}
                       </text>
                       
                       {/* Neurons */}
                       {Array.from({ length: layerSize }).map((_, neuronIndex) => {
                         const centerY = Math.max(175, Math.max(...networkStructure) * 17.5 + 50)
                         const y = centerY - (layerSize - 1) * 17.5 + neuronIndex * 35
                         return (
                           <g key={neuronIndex}>
                             <circle
                               cx={70 + layerIndex * 140}
                               cy={y}
                               r="18"
                               fill={isTraining ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                               stroke="hsl(var(--border))"
                               strokeWidth="2"
                               className={isTraining ? "animate-pulse" : ""}
                             />
                             <text
                               x={70 + layerIndex * 140}
                               y={y + 5}
                               textAnchor="middle"
                               className="text-xs fill-background font-bold"
                             >
                               {neuronIndex + 1}
                             </text>
                           </g>
                         )
                       })}
                     </g>
                   ))}
                   
                   {/* Training indicator */}
                   {isTraining && (
                     <g>
                       <circle cx="30" cy="30" r="8" fill="hsl(var(--destructive))" className="animate-ping" />
                       <text x="45" y="35" className="text-xs fill-destructive font-medium">Training...</text>
                     </g>
                   )}
                 </svg>
               </div>
             </div>
           </CardContent>
         </Card>
      </div>

      {/* Training Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Training Progress</CardTitle>
          <CardDescription>Monitor the network's learning progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Accuracy</span>
              <span className="text-2xl font-bold text-primary">
                {(accuracy * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${accuracy * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">{hiddenLayers[0]}</div>
                <div className="text-xs text-muted-foreground">Hidden Layers</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">{networkStructure.reduce((a, b) => a + b, 0)}</div>
                <div className="text-xs text-muted-foreground">Total Neurons</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">{learningRate[0].toFixed(3)}</div>
                <div className="text-xs text-muted-foreground">Learning Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 