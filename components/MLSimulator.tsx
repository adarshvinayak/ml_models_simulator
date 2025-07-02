'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LinearRegressionSimulator } from '@/components/models/LinearRegressionSimulator'
import { NeuralNetworkSimulator } from '@/components/models/NeuralNetworkSimulator'
import { DecisionTreeSimulator } from '@/components/models/DecisionTreeSimulator'
import { KMeansSimulator } from '@/components/models/KMeansSimulator'
import { SVMSimulator } from '@/components/models/SVMSimulator'
import { HelpModal } from '@/components/help-modal'
import { Brain, GitBranch, Layers, Target, Zap, HelpCircle } from 'lucide-react'

const models = [
  {
    id: 'linear-regression',
    name: 'Linear Regression',
    description: 'Predict continuous values using linear relationships',
    icon: Target,
    component: LinearRegressionSimulator
  },
  {
    id: 'neural-network',
    name: 'Neural Network',
    description: 'Deep learning for complex pattern recognition',
    icon: Brain,
    component: NeuralNetworkSimulator
  },
  {
    id: 'decision-tree',
    name: 'Decision Tree',
    description: 'Make decisions through branching logic',
    icon: GitBranch,
    component: DecisionTreeSimulator
  },
  {
    id: 'k-means',
    name: 'K-Means Clustering',
    description: 'Group similar data points into clusters',
    icon: Layers,
    component: KMeansSimulator
  },
  {
    id: 'svm',
    name: 'Support Vector Machine',
    description: 'Find optimal boundaries for classification',
    icon: Zap,
    component: SVMSimulator
  }
]

export function MLSimulator() {
  const [selectedModel, setSelectedModel] = useState('linear-regression')
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Model Selection */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {models.map((model) => {
            const IconComponent = model.icon
            const isSelected = selectedModel === model.id
            return (
              <Button
                key={model.id}
                variant={isSelected ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center gap-3 transition-all duration-200 ${
                  isSelected 
                    ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                    : "hover:scale-102 hover:shadow-md"
                }`}
                onClick={() => setSelectedModel(model.id)}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background/10">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm">{model.name}</div>
                  <div className="text-xs opacity-80 mt-1">{model.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Selected Model Content */}
      {models.map((model) => {
        if (model.id !== selectedModel) return null
        const SimulatorComponent = model.component
        
        return (
          <div key={model.id} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <model.icon className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle>{model.name}</CardTitle>
                      <CardDescription>{model.description}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowHelp(true)}
                    className="h-8 w-8"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <SimulatorComponent />
              </CardContent>
            </Card>
          </div>
        )
      })}

      {/* Help Modal */}
      <HelpModal 
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        modelType={selectedModel}
      />
    </div>
  )
} 