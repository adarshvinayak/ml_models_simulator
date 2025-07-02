"use client"

import { Modal } from "@/components/ui/modal"

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
  modelType: string
}

const modelExplanations = {
  'linear-regression': {
    title: 'Linear Regression',
    description: 'Linear regression finds the best straight line through data points to predict continuous values.',
    howItWorks: [
      'Takes input features (X) and tries to predict a target value (Y)',
      'Finds the line equation: Y = slope × X + intercept',
      'Minimizes the distance between actual and predicted values',
      'Works best when data has a linear relationship'
    ],
    keyParameters: [
      'Slope: How steep the line is',
      'Intercept: Where the line crosses the Y-axis',
      'Noise Level: Random variation in the data'
    ]
  },
  'neural-network': {
    title: 'Neural Network',
    description: 'Neural networks learn complex patterns using interconnected layers of artificial neurons.',
    howItWorks: [
      'Input layer receives data',
      'Hidden layers process and transform information',
      'Each neuron applies weights and activation functions',
      'Output layer produces final predictions',
      'Network learns by adjusting weights during training'
    ],
    keyParameters: [
      'Hidden Layers: Number of processing layers',
      'Neurons per Layer: Processing units in each layer',
      'Learning Rate: How fast the network learns',
      'Epochs: Number of training iterations'
    ]
  },
  'decision-tree': {
    title: 'Decision Tree',
    description: 'Decision trees make predictions by asking a series of yes/no questions about the data.',
    howItWorks: [
      'Starts with the root node containing all data',
      'Splits data based on feature values',
      'Creates branches for different outcomes',
      'Continues splitting until reaching leaf nodes',
      'Each leaf represents a prediction'
    ],
    keyParameters: [
      'Max Depth: How many questions can be asked',
      'Min Samples: Minimum data points in each leaf',
      'Features: Number of input variables to consider'
    ]
  },
  'k-means': {
    title: 'K-Means Clustering',
    description: 'K-Means groups similar data points together into clusters without knowing the correct answers.',
    howItWorks: [
      'Choose the number of clusters (K)',
      'Randomly place cluster centers (centroids)',
      'Assign each point to the nearest centroid',
      'Move centroids to the center of their assigned points',
      'Repeat until centroids stop moving'
    ],
    keyParameters: [
      'K (Number of Clusters): How many groups to create',
      'Data Points: Number of items to cluster',
      'Max Iterations: How many times to refine clusters'
    ]
  },
  'svm': {
    title: 'Support Vector Machine',
    description: 'SVM finds the best boundary to separate different classes of data with maximum margin.',
    howItWorks: [
      'Finds the optimal decision boundary between classes',
      'Maximizes the margin (distance) between classes',
      'Uses support vectors (key data points) to define boundary',
      'Can use kernels for non-linear boundaries',
      'Works well with high-dimensional data'
    ],
    keyParameters: [
      'C Parameter: Controls trade-off between margin and errors',
      'Kernel Type: Linear (straight line) vs RBF (curved)',
      'Gamma: Controls how far influence of training examples reaches'
    ]
  }
}

export function HelpModal({ isOpen, onClose, modelType }: HelpModalProps) {
  const model = modelExplanations[modelType as keyof typeof modelExplanations]
  
  if (!model) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={model.title}>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-primary mb-2">What is it?</h3>
          <p className="text-sm text-muted-foreground">{model.description}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-primary mb-2">How it works:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            {model.howItWorks.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center mr-2 mt-0.5 font-semibold">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-primary mb-2">Key Parameters:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            {model.keyParameters.map((param, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-muted-foreground mt-2 mr-2 flex-shrink-0" />
                {param}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  )
} 