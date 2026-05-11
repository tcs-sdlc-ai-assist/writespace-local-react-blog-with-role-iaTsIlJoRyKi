import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import BlogCard from '../components/BlogCard.jsx';
import { getPosts } from '../utils/storage.js';
import { isAuthenticated } from '../utils/auth.js';

/**
 * Home page component that displays all blog posts in a responsive grid.
 * Accessible at '/blogs'. Posts are sorted newest first.
 * Shows an empty state with a CTA when no posts exist.
 */
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPosts(sorted);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <p className="text-lg text-neutral-600">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Blogs</h1>
              <p className="mt-1 text-sm text-gray-500">
                Browse the latest posts from the community.
              </p>
            </div>
            {isAuthenticated() && (
              <Link
                to="/write"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                ✍️ Write a Post
              </Link>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow-card">
              <div className="mb-4 text-5xl">📝</div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                No posts yet
              </h2>
              <p className="mb-6 text-gray-500">
                Be the first to share your thoughts with the community!
              </p>
              {isAuthenticated() && (
                <Link
                  to="/write"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  ✍️ Write your first post
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}