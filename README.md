# Little Bird - Political Intelligence Platform

A professional Next.js application designed for boutique lobbying firms, featuring advanced analytics and compliance tools.

## Features

- **Bill Tracking**: Real-time monitoring of legislation across all levels of government
- **Compliance Management**: Stay compliant with all lobbying regulations and reporting requirements  
- **Strategic Analytics**: Data-driven insights to inform your lobbying strategy and decisions

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Theme**: Dark high-contrast design with indigo accents

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and CSS variables
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Home page component
└── components/
    └── ui/              # shadcn/ui components
        ├── button.tsx
        └── card.tsx
```

## Design System

The application uses a dark theme with high contrast and indigo accents:
- **Primary Background**: Slate 950
- **Card Background**: Slate 800  
- **Accent Color**: Indigo 400/600
- **Text**: White with slate variations for hierarchy

## License

Private - All rights reserved