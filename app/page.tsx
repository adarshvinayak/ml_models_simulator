import { MLSimulator } from '@/components/MLSimulator'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
              ML Models Simulator
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore and interact with different machine learning models
            </p>
          </div>
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </div>
        <MLSimulator />
      </div>
    </div>
  )
} 