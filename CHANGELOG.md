# Changelog

All notable changes to the WriteSpace Blog project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

- **Public Landing Page**: Welcoming homepage with featured blog posts, hero section, and responsive layout for all visitors (SCRUM-18933)
- **Authentication System**: Complete login and registration flow with form validation, protected routes, and session management (SCRUM-18934)
- **Blog CRUD Operations**: Full create, read, update, and delete functionality for blog posts with rich text content support (SCRUM-18935)
- **Admin Dashboard**: Centralized dashboard for administrators to manage blog content, view statistics, and oversee platform activity
- **User Management**: Role-based access control with admin and regular user roles, profile management, and user listing for administrators
- **localStorage Persistence**: Client-side data persistence using localStorage for authentication tokens, user preferences, and draft blog posts
- **Responsive Tailwind UI**: Fully responsive user interface built with Tailwind CSS utility classes, supporting mobile, tablet, and desktop viewports with dark mode compatibility
- **Vercel Deployment**: Production-ready configuration for seamless deployment on Vercel with Vite build optimization and environment variable support via `import.meta.env.VITE_*`

### Technical Stack

- React 18+ with Vite for fast development and optimized production builds
- React Router for client-side routing with protected route guards
- Tailwind CSS for utility-first responsive styling
- PropTypes for runtime component prop validation
- JavaScript (ES6+ with JSX) throughout the codebase