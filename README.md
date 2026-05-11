# WriteSpace Blog

A modern, responsive blogging platform built with React and Vite. WriteSpace allows users to create, read, edit, and delete blog posts with a clean, intuitive interface. All data is persisted locally using the browser's localStorage.

## Features

- **Create Posts** — Write and publish blog posts with a title, content, and author name
- **Read Posts** — Browse all published posts on the home feed or view individual post details
- **Edit Posts** — Update existing posts with an inline editing experience
- **Delete Posts** — Remove posts with a confirmation prompt to prevent accidental deletion
- **Search & Filter** — Search posts by title or content, filter by author
- **Responsive Design** — Fully responsive layout optimized for mobile, tablet, and desktop using Tailwind CSS
- **Dark Mode** — Toggle between light and dark themes with persistent preference
- **Markdown Support** — Write post content using Markdown syntax with live preview
- **Slug-based Routing** — SEO-friendly URLs for individual blog posts
- **LocalStorage Persistence** — All data stored client-side with no backend required

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI component library |
| **Vite** | Build tool and dev server |
| **React Router v6** | Client-side routing |
| **Tailwind CSS** | Utility-first styling |
| **PropTypes** | Runtime prop validation |
| **localStorage** | Client-side data persistence |

## Folder Structure

```
writespace-blog/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── BlogCard.jsx          # Post preview card for the feed
│   │   ├── BlogEditor.jsx        # Create/edit post form
│   │   ├── ConfirmDialog.jsx     # Reusable confirmation modal
│   │   ├── Footer.jsx            # Site footer
│   │   ├── Header.jsx            # Navigation header with theme toggle
│   │   ├── Layout.jsx            # Page layout wrapper
│   │   ├── MarkdownRenderer.jsx  # Renders Markdown content as HTML
│   │   └── SearchBar.jsx         # Search and filter controls
│   ├── context/
│   │   ├── BlogContext.js        # Blog data context and provider
│   │   └── ThemeContext.js       # Theme (dark/light) context and provider
│   ├── hooks/
│   │   ├── useBlog.js            # Custom hook for blog CRUD operations
│   │   ├── useLocalStorage.js    # Custom hook for localStorage read/write
│   │   └── useTheme.js           # Custom hook for theme access
│   ├── pages/
│   │   ├── CreatePost.jsx        # New post creation page
│   │   ├── EditPost.jsx          # Edit existing post page
│   │   ├── Home.jsx              # Home feed with all posts
│   │   ├── NotFound.jsx          # 404 page
│   │   └── PostDetail.jsx        # Single post view page
│   ├── utils/
│   │   ├── generateId.js         # Unique ID generator
│   │   ├── generateSlug.js       # URL slug generator from title
│   │   └── formatDate.js         # Date formatting utility
│   ├── App.jsx                   # Root component with router and providers
│   ├── index.css                 # Tailwind directives and global styles
│   └── main.jsx                  # Application entry point
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── postcss.config.js             # PostCSS configuration for Tailwind
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.js                # Vite build configuration
└── README.md                     # Project documentation (this file)
```

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd writespace-blog
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:

   ```
   http://localhost:5173
   ```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Build the production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

## Build & Deployment

### Production Build

```bash
npm run build
```

This generates an optimized static build in the `dist/` directory. The output is a fully static site that can be deployed to any static hosting provider.

### Deployment Options

- **Vercel** — Connect the repository and deploy automatically. Set the build command to `npm run build` and the output directory to `dist`.
- **Netlify** — Same configuration as Vercel. Add a `_redirects` file in `public/` with `/* /index.html 200` for SPA routing support.
- **GitHub Pages** — Use `vite.config.js` to set `base` to your repository name, then deploy the `dist/` folder.
- **Docker** — Serve the `dist/` folder with nginx or any static file server.

### Environment Variables

All environment variables must be prefixed with `VITE_` to be exposed to the client:

| Variable | Description | Default |
|---|---|---|
| `VITE_APP_TITLE` | Application title displayed in the header | `WriteSpace` |

Access in code via `import.meta.env.VITE_APP_TITLE`.

## localStorage Schema

All application data is stored in the browser's `localStorage` under the following keys:

### `writespace_posts`

An array of blog post objects.

```json
[
  {
    "id": "a1b2c3d4",
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "## Hello World\n\nThis is my first blog post written in **Markdown**.",
    "author": "Jane Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
]
```

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier generated via `generateId()` |
| `title` | `string` | Post title (required, max 200 characters) |
| `slug` | `string` | URL-friendly slug derived from the title |
| `content` | `string` | Post body in Markdown format |
| `author` | `string` | Author display name (required) |
| `createdAt` | `string` (ISO 8601) | Timestamp when the post was created |
| `updatedAt` | `string` (ISO 8601) | Timestamp when the post was last modified |

### `writespace_theme`

A string value representing the current theme preference.

```json
"dark"
```

| Value | Description |
|---|---|
| `"light"` | Light mode (default) |
| `"dark"` | Dark mode |

## Route Map

| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Home feed displaying all blog posts |
| `/post/:slug` | `PostDetail` | Individual post view by slug |
| `/create` | `CreatePost` | Form to create a new blog post |
| `/edit/:slug` | `EditPost` | Form to edit an existing blog post |
| `*` | `NotFound` | 404 page for unmatched routes |

## User Stories

- **SCRUM-18933** — As a user, I can create, read, update, and delete blog posts so that I can manage my content.
- **SCRUM-18934** — As a user, I can search and filter posts so that I can quickly find relevant content.
- **SCRUM-18935** — As a user, I can toggle between light and dark themes so that I can read comfortably in any environment.

## License

**Private** — All rights reserved. This project is proprietary and not licensed for public use, distribution, or modification.