# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Architecture Overview

This is a Next.js 15 application built with TypeScript and Tailwind CSS that provides a dashboard for analyzing AI agent product traffic data.

### Core Structure

- **Frontend Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **State Management**: React hooks (useState, useEffect, useMemo)
- **Data Visualization**: Recharts library
- **Icons**: Lucide React

### Key Components

- `Dashboard.tsx` - Main dashboard container with state management, data loading, and filtering logic
- `TrafficChart.tsx` - Chart visualization for traffic data comparison
- `ProductCard.tsx` - Individual product display with metrics and growth indicators
- `FilterControls.tsx` - Filter panel for date ranges, product selection, and sorting
- `agent-products.ts` - Configuration file containing all 29 AI agent products with categories

### Data Flow

1. Dashboard loads traffic data via `similarweb-api.ts` (falls back to mock data)
2. Data is stored in a Map<string, TrafficData[]> for efficient lookups
3. Filters are applied to products and reflected in both chart and cards
4. Growth calculations compare current vs previous month data

### Product Categories

Products are categorized as: `chatbot`, `coding`, `writing`, `productivity`, `other`

### API Integration

- SimilarWeb API integration available via environment configuration
- Mock data generation fallback when API unavailable
- Traffic data includes visits, pageViews, bounceRate, avgSessionDuration

### UI/UX Patterns

- Responsive grid layouts (1 col mobile, 4 col desktop)
- Loading states with spinner animations
- Data source indicators (SimilarWeb API vs Mock Data)
- Real-time refresh functionality
- Product selection for chart comparison

## File Organization

- `/src/app/` - Next.js App Router pages
- `/src/components/` - React components and UI elements
- `/src/config/` - Static configuration (agent products list)
- `/src/lib/` - Utility functions and API clients
- `/src/types/` - TypeScript type definitions