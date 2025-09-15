# TechForge Solutions - Enterprise Portfolio Website

## Overview

This is a comprehensive enterprise portfolio website built for TechForge Solutions, a global software development company. The application features a modern, responsive frontend with an admin dashboard for content management, along with a robust backend supporting user authentication, content management, and lead generation. The system is designed to showcase the company's services, portfolio projects, blog content, and team members while providing administrative capabilities for content updates and customer relationship management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js-style React application using Vite for build tooling and development
- **Language**: Full TypeScript implementation for type safety across the entire frontend
- **Styling**: Tailwind CSS with a custom design system and Shadcn/UI component library
- **State Management**: React Query for server state management with custom query client configuration
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod schema validation for type-safe form handling
- **UI Components**: Radix UI primitives through Shadcn/UI for accessible, composable components
- **Animations**: Framer Motion for micro-interactions and scroll-based animations

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API services
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with OpenID Connect for secure user management
- **Session Management**: PostgreSQL-backed session storage with configurable TTL
- **API Design**: RESTful endpoints with proper error handling and validation middleware
- **File Structure**: Modular architecture separating routes, storage layer, and authentication logic

### Data Storage Design
- **ORM**: Drizzle ORM providing type-safe database queries and migrations
- **Schema**: Comprehensive database schema supporting users, pages, blog posts, projects, team members, leads, and settings
- **Database Provider**: Neon PostgreSQL with connection pooling for scalability
- **Session Store**: PostgreSQL session table for secure authentication state management
- **Migration System**: Drizzle Kit for database schema versioning and deployments

### Authentication & Authorization
- **Provider**: Replit Auth with OpenID Connect for secure authentication flow
- **Session Strategy**: Server-side sessions stored in PostgreSQL with httpOnly cookies
- **Role-Based Access**: User roles (user, admin) for controlling access to admin features
- **Security**: Secure cookie configuration with environment-specific settings

### Content Management System
- **Pages**: Dynamic page creation with slug-based routing and rich content support
- **Blog System**: Full blog management with categories, tags, and featured posts
- **Portfolio**: Project showcase with client information, technologies, and case studies
- **Team Management**: Team member profiles with social links and expertise areas
- **Rich Content**: JSON-based content storage supporting complex layouts and media

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database connectivity
- **drizzle-orm**: Type-safe ORM for PostgreSQL operations and query building
- **express**: Web application framework for Node.js backend services
- **@tanstack/react-query**: Powerful data fetching and caching library for React

### Authentication & Security
- **openid-client**: OpenID Connect client for Replit Auth integration
- **passport**: Authentication middleware for Node.js applications
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **express-session**: Session middleware for Express applications

### UI & Styling
- **@radix-ui/react-***: Collection of accessible React components for UI primitives
- **tailwindcss**: Utility-first CSS framework for responsive design
- **class-variance-authority**: Utility for managing conditional CSS classes
- **framer-motion**: Animation library for React applications

### Development & Build Tools
- **vite**: Fast build tool and development server with hot module replacement
- **typescript**: Static type checking for JavaScript applications
- **tsx**: TypeScript execution engine for Node.js development
- **esbuild**: Fast JavaScript bundler for production builds

### Email Services
- **@sendgrid/mail**: Email delivery service for contact forms and notifications (optional in development)

### Form Handling & Validation
- **react-hook-form**: Performant forms library with easy validation
- **@hookform/resolvers**: Resolvers for various validation schema libraries
- **zod**: TypeScript-first schema validation library for runtime type checking

The application is designed to run on Replit's infrastructure but can be deployed to any Node.js-compatible hosting platform with PostgreSQL support.