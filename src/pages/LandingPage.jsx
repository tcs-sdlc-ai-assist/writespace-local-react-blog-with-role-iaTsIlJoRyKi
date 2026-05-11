import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar.jsx';
import { getPosts } from '../utils/storage.js';

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

function truncate(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
}

const features = [
  {
    icon: '✍️',
    title: 'Write & Publish',
    description:
      'Create beautiful blog posts with a clean, distraction-free editor. Share your thoughts with the world in seconds.',
  },
  {
    icon: '🔒',
    title: 'Role-Based Access',
    description:
      'Secure your platform with built-in authentication. Admins manage everything while users focus on writing.',
  },
  {
    icon: '⚡',
    title: 'Instant & Local',
    description:
      'No backend needed. All data is stored locally in your browser for lightning-fast performance and total privacy.',
  },
];

export default function LandingPage() {
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    const posts = getPosts();
    const sorted = [...posts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
    setLatestPosts(sorted);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-20 text-center sm:py-28">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Welcome to WriteSpace
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-primary-100 sm:text-xl">
            A modern blogging platform where ideas come to life. Write, share, and
            discover stories that matter — all from your browser.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-md transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700"
            >
              Get Started — It&apos;s Free
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-neutral-900 sm:text-4xl">
              Why WriteSpace?
            </h2>
            <p className="mx-auto max-w-xl text-neutral-600">
              Everything you need to start blogging, with zero setup and no
              external dependencies.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-neutral-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-neutral-900 sm:text-4xl">
              Latest Posts
            </h2>
            <p className="mx-auto max-w-xl text-neutral-600">
              Check out what the community has been writing about recently.
            </p>
          </div>

          {latestPosts.length === 0 ? (
            <div className="rounded-lg bg-neutral-50 p-12 text-center">
              <p className="mb-2 text-lg font-medium text-neutral-700">
                No posts yet
              </p>
              <p className="mb-6 text-sm text-neutral-500">
                Be the first to share your story on WriteSpace.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
              >
                Start Writing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col rounded-lg bg-neutral-50 p-6 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <span className="mb-2 text-xs font-medium text-neutral-500">
                    {formatDate(post.createdAt)}
                  </span>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">
                    {post.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600">
                    {truncate(post.content, 120)}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-neutral-200 pt-4">
                    <span className="text-sm font-medium text-neutral-700">
                      {post.authorName || 'Unknown'}
                    </span>
                    <Link
                      to="/login"
                      className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div>
              <Link
                to="/"
                className="text-xl font-bold text-primary-700 transition-colors hover:text-primary-900"
              >
                ✍️ WriteSpace
              </Link>
              <p className="mt-1 text-sm text-neutral-500">
                A modern blogging platform for everyone.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-primary-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-primary-600"
              >
                Register
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-neutral-200 pt-6 text-center">
            <p className="text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}