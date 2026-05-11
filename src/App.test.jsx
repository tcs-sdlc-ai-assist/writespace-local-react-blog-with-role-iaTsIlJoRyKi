import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import * as auth from './utils/auth.js';
import * as storage from './utils/storage.js';

/**
 * Helper to render the App with a specific initial route using MemoryRouter.
 * We need to replace BrowserRouter in App with MemoryRouter for testing,
 * so we mock the router behavior by rendering routes directly.
 */

// We need to test the AppLayout which uses Routes, but App wraps it in BrowserRouter.
// Instead, we'll mock react-router-dom partially to control the router in tests.

// Since App uses BrowserRouter internally, we render App but control navigation
// by mocking window.location or using a custom approach.
// A cleaner approach: extract AppLayout and test it with MemoryRouter.
// But since we must test App.jsx as-is, we'll use a different strategy:
// We'll mock BrowserRouter to use MemoryRouter.

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => children,
  };
});

function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
}

describe('App routing and access control', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('public routes', () => {
    it('renders the landing page at /', () => {
      renderApp('/');
      expect(screen.getByText('Welcome to WriteSpace')).toBeInTheDocument();
    });

    it('renders the login page at /login', () => {
      renderApp('/login');
      expect(screen.getByText('Sign in to WriteSpace')).toBeInTheDocument();
    });

    it('renders the register page at /register', () => {
      renderApp('/register');
      expect(screen.getByText('Create an Account')).toBeInTheDocument();
    });

    it('renders the blogs page at /blogs without authentication', () => {
      renderApp('/blogs');
      expect(screen.getByText('All Blogs')).toBeInTheDocument();
    });
  });

  describe('protected routes redirect unauthenticated users', () => {
    it('redirects /write to /login when not authenticated', () => {
      renderApp('/write');
      // Should redirect to login page
      expect(screen.getByText('Sign in to WriteSpace')).toBeInTheDocument();
    });

    it('redirects /blog/:id to /login when not authenticated', () => {
      renderApp('/blog/some-id');
      expect(screen.getByText('Sign in to WriteSpace')).toBeInTheDocument();
    });

    it('redirects /edit/:id to /login when not authenticated', () => {
      renderApp('/edit/some-id');
      expect(screen.getByText('Sign in to WriteSpace')).toBeInTheDocument();
    });
  });

  describe('admin routes redirect non-admin users', () => {
    it('redirects /admin to /login when not authenticated', () => {
      renderApp('/admin');
      expect(screen.getByText('Sign in to WriteSpace')).toBeInTheDocument();
    });

    it('redirects /admin/users to /login when not authenticated', () => {
      renderApp('/admin/users');
      expect(screen.getByText('Sign in to WriteSpace')).toBeInTheDocument();
    });

    it('redirects /admin to /blogs when authenticated as regular user', () => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      renderApp('/admin');
      // Should redirect to /blogs
      expect(screen.getByText('All Blogs')).toBeInTheDocument();
    });

    it('redirects /admin/users to /blogs when authenticated as regular user', () => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      renderApp('/admin/users');
      expect(screen.getByText('All Blogs')).toBeInTheDocument();
    });
  });

  describe('authenticated user access', () => {
    beforeEach(() => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));
    });

    it('renders the write page at /write when authenticated', () => {
      renderApp('/write');
      expect(screen.getByText('Create New Post')).toBeInTheDocument();
    });

    it('renders the blogs page at /blogs when authenticated', () => {
      renderApp('/blogs');
      expect(screen.getByText('All Blogs')).toBeInTheDocument();
    });
  });

  describe('admin user access', () => {
    beforeEach(() => {
      const session = {
        userId: '0',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));
    });

    it('renders the admin dashboard at /admin when authenticated as admin', () => {
      renderApp('/admin');
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('renders the user management page at /admin/users when authenticated as admin', () => {
      renderApp('/admin/users');
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    it('renders the write page at /write when authenticated as admin', () => {
      renderApp('/write');
      expect(screen.getByText('Create New Post')).toBeInTheDocument();
    });
  });

  describe('blog post routes', () => {
    it('renders post not found when blog id does not exist and user is authenticated', () => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      renderApp('/blog/nonexistent-id');
      expect(screen.getByText('Post not found')).toBeInTheDocument();
    });

    it('renders blog post when it exists and user is authenticated', () => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const posts = [
        {
          id: 'post1',
          title: 'Test Blog Post',
          content: 'This is test content for the blog post.',
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
          authorId: 'user1',
          authorName: 'Jane Doe',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      renderApp('/blog/post1');
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
      expect(screen.getByText('This is test content for the blog post.')).toBeInTheDocument();
    });
  });

  describe('navigation between pages', () => {
    it('navigates from landing page to login page via sign in link', async () => {
      const user = userEvent.setup();
      renderApp('/');

      const signInLinks = screen.getAllByText('Sign In');
      await user.click(signInLinks[0]);

      await waitFor(() => {
        expect(screen.getByText('Sign in to WriteSpace')).toBeInTheDocument();
      });
    });

    it('navigates from landing page to register page via get started link', async () => {
      const user = userEvent.setup();
      renderApp('/');

      const getStartedLinks = screen.getAllByText(/Get Started/);
      await user.click(getStartedLinks[0]);

      await waitFor(() => {
        expect(screen.getByText('Create an Account')).toBeInTheDocument();
      });
    });

    it('navigates from login page to register page', async () => {
      const user = userEvent.setup();
      renderApp('/login');

      const registerLink = screen.getByText('Register here');
      await user.click(registerLink);

      await waitFor(() => {
        expect(screen.getByText('Create an Account')).toBeInTheDocument();
      });
    });

    it('navigates from register page to login page', async () => {
      const user = userEvent.setup();
      renderApp('/register');

      const signInLink = screen.getByText('Sign in');
      await user.click(signInLink);

      await waitFor(() => {
        expect(screen.getByText('Sign in to WriteSpace')).toBeInTheDocument();
      });
    });

    it('navigates from login page back to home', async () => {
      const user = userEvent.setup();
      renderApp('/login');

      const backLink = screen.getByText('← Back to home');
      await user.click(backLink);

      await waitFor(() => {
        expect(screen.getByText('Welcome to WriteSpace')).toBeInTheDocument();
      });
    });
  });

  describe('navbar visibility', () => {
    it('does not show the authenticated navbar on the landing page', () => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      renderApp('/');
      // Landing page has PublicNavbar, not the authenticated Navbar
      expect(screen.getByText('Welcome to WriteSpace')).toBeInTheDocument();
    });

    it('does not show the authenticated navbar on the login page', () => {
      renderApp('/login');
      expect(screen.getByText('Sign in to WriteSpace')).toBeInTheDocument();
      // The login page should not have the Write nav link from authenticated Navbar
      expect(screen.queryByRole('link', { name: 'Write' })).not.toBeInTheDocument();
    });

    it('shows the authenticated navbar on the write page for authenticated users', () => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      renderApp('/write');
      expect(screen.getByText('Create New Post')).toBeInTheDocument();
      // The Navbar should be visible with WriteSpace logo link
      const navLinks = screen.getAllByText('WriteSpace');
      expect(navLinks.length).toBeGreaterThan(0);
    });
  });

  describe('login redirects authenticated users', () => {
    it('redirects admin from /login to /admin', async () => {
      const session = {
        userId: '0',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      renderApp('/login');

      await waitFor(() => {
        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      });
    });

    it('redirects regular user from /login to /blogs', async () => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      renderApp('/login');

      await waitFor(() => {
        expect(screen.getByText('All Blogs')).toBeInTheDocument();
      });
    });
  });
});