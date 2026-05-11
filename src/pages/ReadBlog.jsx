import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPosts, savePosts } from '../utils/storage.js';
import { getCurrentUser, isAuthenticated, isAdmin } from '../utils/auth.js';
import { getAvatar } from '../components/Avatar.jsx';

function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const currentUser = isAuthenticated() ? getCurrentUser() : null;

  useEffect(() => {
    const posts = getPosts();
    const found = posts.find((p) => p.id === id);
    if (found) {
      setPost(found);
    } else {
      setNotFound(true);
    }
  }, [id]);

  const canEdit = () => {
    if (!currentUser || !post) return false;
    return currentUser.role === 'admin' || post.authorId === currentUser.userId;
  };

  const canDelete = () => {
    if (!currentUser || !post) return false;
    return currentUser.role === 'admin' || post.authorId === currentUser.userId;
  };

  const handleDelete = () => {
    const posts = getPosts();
    const updated = posts.filter((p) => p.id !== id);
    savePosts(updated);
    navigate('/blogs');
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Post not found</h1>
          <p className="mb-6 text-gray-600">
            The blog post you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/blogs"
            className="inline-block rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
          >
            ← Back to Blogs
          </Link>
        </div>

        <article className="rounded-lg bg-white p-6 shadow-card sm:p-8">
          <header className="mb-6">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              {post.title}
            </h1>

            <div className="flex items-center gap-3">
              {getAvatar(post.authorId === '0' ? 'admin' : 'user', 'md')}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {post.authorName}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
          </header>

          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {post.content}
            </div>
          </div>

          {(canEdit() || canDelete()) && (
            <div className="mt-8 flex items-center gap-3 border-t border-gray-200 pt-6">
              {canEdit() && (
                <Link
                  to={`/edit/${post.id}`}
                  className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                  Edit
                </Link>
              )}
              {canDelete() && (
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="inline-flex items-center rounded-lg bg-danger-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger-700"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </article>

        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h2 className="mb-2 text-lg font-bold text-gray-900">
                Delete Post
              </h2>
              <p className="mb-6 text-sm text-gray-600">
                Are you sure you want to delete &quot;{post.title}&quot;? This action
                cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-lg bg-danger-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReadBlog;