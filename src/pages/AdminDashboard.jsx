import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StatCard } from '../components/StatCard.jsx';
import { getPosts, savePosts, getUsers } from '../utils/storage.js';
import { getCurrentUser, isAdmin } from '../utils/auth.js';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/blogs', { replace: true });
      return;
    }
    setSession(currentUser);
    setPosts(getPosts());
    setUsers(getUsers());
  }, [navigate]);

  if (!session || !isAdmin()) {
    return null;
  }

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1;
  const userCount = users.filter((u) => u.role === 'user').length;

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  function handleDeletePost(postId) {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) {
      return;
    }
    const updatedPosts = posts.filter((p) => p.id !== postId);
    savePosts(updatedPosts);
    setPosts(updatedPosts);
  }

  function handleEditPost(postId) {
    navigate(`/edit/${postId}`);
  }

  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {session.displayName}. Here&apos;s an overview of your platform.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Posts" value={totalPosts} icon="📝" />
          <StatCard label="Total Users" value={totalUsers} icon="👥" />
          <StatCard label="Admins" value={adminCount} icon="👑" />
          <StatCard label="Users" value={userCount} icon="📖" />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/write"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              ✍️ Write a Post
            </Link>
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              👥 Manage Users
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Recent Posts</h2>
          {recentPosts.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-md">
              <p className="text-gray-500">No posts yet. Create your first post!</p>
              <Link
                to="/write"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                ✍️ Write a Post
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentPosts.map((post) => (
                    <tr key={post.id} className="transition-colors hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {post.title.length > 50
                            ? post.title.substring(0, 50) + '...'
                            : post.title}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {post.authorName || 'Unknown'}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                        <button
                          onClick={() => handleEditPost(post.id)}
                          className="mr-3 font-medium text-indigo-600 transition-colors hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="font-medium text-red-600 transition-colors hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}