# EczEase Architecture Documentation

## Overview

EczEase is a comprehensive platform designed to help individuals with eczema and food allergies manage their conditions through technology. The platform includes features like an AI chatbot, symptom tracking, naturopath directory, and educational content.

## Technology Stack

### Frontend

- **Framework**: [Angular](https://angular.io/) (v19.x)
- **Meta-Framework**: [Analog.js](https://analogjs.org/) - A fullstack Angular meta-framework providing file-based routing, API routes, and more
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI development
- **Package Management**: [PNPM](https://pnpm.io/) - Fast, disk space efficient package manager

### Backend

- **API**: RESTful API endpoints created using Analog.js API routes
- **Database**: (To be determined based on requirements)
- **Authentication**: (To be determined based on requirements)

### Development Environment

- **Workspace Management**: [Nx](https://nx.dev/) - Powerful build system and CLI for monorepo management
- **Testing Framework**: Vitest for unit testing
- **Code Quality**: ESLint for code linting, Prettier for code formatting
- **Version Control**: Git with GitHub for repository hosting

### Deployment

- **Cloud Provider**: Google Cloud Platform (GCP)
- **Services**:
  - Cloud Run for containerized application hosting
  - Cloud Storage for static assets
  - Cloud SQL for database (if applicable)
  - Firebase for authentication (if applicable)

## Project Structure

```
eczease/
├── .github/            # GitHub configuration and workflows
├── .nx/                # Nx cache and configuration
├── docs/               # Project documentation
├── node_modules/       # Dependencies (managed by PNPM)
├── webapp/             # Main web application
│   ├── public/         # Static assets
│   │   └── assets/     # Images, fonts, etc.
│   └── src/            # Application source code
│       ├── app/        # Angular application code
│       │   ├── components/  # Reusable UI components
│       │   ├── pages/       # Page components (file-based routing)
│       │   └── server/      # API routes and server-side code
│       ├── styles/     # Global styles
│       └── main.ts     # Application entry point
├── .gitignore          # Git ignore file
├── nx.json             # Nx configuration
├── package.json        # Project dependencies and scripts
├── pnpm-lock.yaml      # PNPM lock file
└── tsconfig.base.json  # Base TypeScript configuration
```

## Application Architecture

### Frontend Architecture

The frontend follows a component-based architecture typical of Angular applications, with some additional patterns from Analog.js:

1. **Pages**: Follows Analog.js file-based routing convention

   - Files in the `app/pages` directory automatically become routes
   - Dynamic routes use parentheses notation: `(user).page.ts`

2. **Components**:

   - Standalone Angular components
   - Follows a hierarchical structure
   - Shared components in the `components` directory

3. **State Management**:
   - Uses Angular signals for reactive state management
   - HTTP client for API communication

### Backend Architecture

The backend uses Analog.js API routes:

1. **API Endpoints**:

   - Located in `app/server/routes`
   - Each file creates a corresponding API endpoint
   - Supports HTTP methods (GET, POST, PUT, DELETE)

2. **Data Flow**:
   - Client-side forms submit data to API endpoints
   - API routes process requests and return responses
   - Database interactions (when implemented) will follow repository pattern

## Feature Roadmap

The platform will be rolled out in phases:

1. **MVP (Minimum Viable Product)**:

   - Landing page with email collection (completed)
   - AI Chatbot for basic eczema and food allergy guidance (coming first)

2. **Phase 2**:

   - Symptom Tracking
   - Basic Educational Content

3. **Phase 3**:
   - Naturopath Directory
   - Enhanced Educational Content
   - Community Support Features

## Deployment Strategy

The application will be deployed to Google Cloud Platform:

1. **CI/CD Pipeline**:

   - GitHub Actions for continuous integration
   - Automated testing and building
   - Deployment to GCP environments

2. **Environments**:

   - Development
   - Staging
   - Production

3. **Infrastructure as Code**:
   - Configuration managed through version control
   - Infrastructure provisioning scripts

## Security Considerations

1. **Authentication and Authorization**:

   - Secure user authentication system
   - Role-based access control

2. **Data Protection**:

   - Encryption of sensitive data
   - HTTPS for all communications
   - Healthcare data compliance standards

3. **API Security**:
   - Rate limiting
   - CORS configuration
   - Input validation and sanitization

## Performance Optimization

1. **Frontend Optimization**:

   - Code splitting for improved load times
   - Image optimization
   - Lazy-loading modules and components

2. **Server-Side Optimization**:
   - Caching strategies
   - Database query optimization
   - Resource monitoring

## Development Guidelines

1. **Coding Standards**:

   - Follow Angular style guide
   - Use TypeScript for type safety
   - Write unit tests for components and services
   - Use single quotes for strings in TypeScript and JavaScript files
   - Code style is enforced by ESLint

2. **Code Style Enforcement**:

   - ESLint is configured to enforce single quotes for strings
   - The configuration is defined in the project's `.eslintrc.json` files
   - VS Code is set up to automatically fix quote style on save
   - Linting can be run manually with `npx nx lint webapp` or `npx nx lint webapp --fix`
   - The lint target is defined in the project.json file for proper NX integration

3. **Git Workflow**:

   - Feature branch strategy
   - Pull request reviews
   - Semantic versioning

4. **Documentation**:
   - Code documentation with JSDoc
   - API documentation
   - User guides for complex features

## Conclusion

EczEase is architected as a modern, scalable web application using Angular, Analog.js, and GCP. The architecture supports the incremental development of features while maintaining high standards for performance, security, and user experience.

This document should be treated as a living document and updated as the architecture evolves.
