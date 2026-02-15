# Karang Taruna Website

A modern web application for Karang Taruna community, providing learning platform and skill development resources for youth empowerment.

## Features

- **Tutorial Management**: Browse and search various skill-based tutorials
- **User Authentication**: Secure login and registration system
- **Admin Dashboard**: Content management and user oversight
- **Responsive Design**: Optimized for desktop and mobile devices
- **Skill Categories**: Organized tutorials across various domains (Plumbing, Electrical, Creative, etc.)

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable React components
│   ├── assets/         # Static assets (images, icons)
│   ├── guidelines/     # Development guidelines
│   └── App.tsx         # Main application component
├── public/             # Public assets
└── package.json        # Project dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint