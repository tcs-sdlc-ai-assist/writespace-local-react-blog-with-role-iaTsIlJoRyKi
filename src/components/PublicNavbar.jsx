import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, isAdmin, getCurrentUser } from '../utils/auth.js';
import { getAvatar } from './Avatar.jsx';

function PublicNavbar() {
  const authenticated = isAuthenticated();
  const user = authenticated ? getCurrentUser() : null;
  const admin = authenticated ? isAdmin() : false;

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-card">
      <Link
        to="/"
        className="text-2xl font-bold tracking-tight text-primary-700 transition-colors hover:text-primary-900"
      >
        ✍️ WriteSpace
      </Link>

      <div className="flex items-center gap-3">
        {authenticated && user ? (
          <>
            <Link
              to={admin ? '/admin' : '/blogs'}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
            >
              {admin ? 'Dashboard' : 'My Blogs'}
            </Link>
            <Link
              to={admin ? '/admin' : '/blogs'}
              className="flex items-center"
              aria-label="Go to dashboard"
            >
              {getAvatar(user.role, 'md')}
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default PublicNavbar;