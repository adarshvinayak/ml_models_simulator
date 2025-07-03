# ML Models Simulator

An interactive web application for exploring and understanding different machine learning models through visual simulations.

[![Visit](https://img.shields.io/badge/Visit-blue?style=for-the-badge)](https://mlsim.netlify.app/)
[![ML Model Simulation](https://img.shields.io/badge/ML%20Model%20Simulation-orange?style=for-the-badge)

## Features

- **Linear Regression**: Visualize how slope and intercept affect the regression line
- **Neural Networks**: Build and train networks with adjustable architecture
- **Decision Trees**: Generate decision trees with configurable parameters
- **K-Means Clustering**: Interactive clustering with real-time visualization
- **Support Vector Machines**: Explore decision boundaries with different kernels

## Built With

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Select a machine learning model from the tabs at the top
2. Adjust parameters using the sliders and controls
3. Generate data or train models using the action buttons
4. Observe how parameter changes affect the model behavior
5. View performance metrics and statistics

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── models/            # ML model simulators
│   └── MLSimulator.tsx    # Main simulator component
├── lib/
│   └── utils.ts           # Utility functions
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE). 
