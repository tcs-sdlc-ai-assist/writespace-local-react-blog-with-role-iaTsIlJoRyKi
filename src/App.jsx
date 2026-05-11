import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { isAuthenticated } from './utils/auth.js';
import PublicNavbar from './components/PublicNavbar.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Home from './pages/Home.jsx';
import ReadBlog from './pages/ReadBlog.jsx';
import WriteBlog from './pages/WriteBlog.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserManagement from './pages/UserManagement.jsx';

/**
 * Routes that should not render any shared navbar.
 * These pages either have their own navbar or no navbar at all.
 */
const noSharedNavbarRoutes = ['/', '/login', '/register', '/blogs'];

/**
 * Layout component that conditionally renders the appropriate navbar
 * based on authentication state and current route.
 */
function AppLayout() {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const pathname = location.pathname;

  const isLandingOrAuth = pathname === '/' || pathname === '/login' || pathname === '/register';
  const isBlogsPage = pathname === '/blogs';

  let showNavbar = false;

  if (!isLandingOrAuth && !isBlogsPage && authenticated) {
    showNavbar = true;
  }

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated routes */}
        <Route path="/blogs" element={<Home />} />
        <Route
          path="/blog/:id"
          element={
            <ProtectedRoute>
              <ReadBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/write"
          element={
            <ProtectedRoute>
              <WriteBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <WriteBlog />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;