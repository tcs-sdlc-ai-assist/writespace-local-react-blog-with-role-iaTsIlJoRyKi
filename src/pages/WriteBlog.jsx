import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPosts, savePosts } from '../utils/storage.js';
import { getCurrentUser, isAdmin } from '../utils/auth.js';

const MAX_CONTENT_LENGTH = 5000;

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10);
}

export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditMode);

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    if (isEditMode) {
      const posts = getPosts();
      const post = posts.find((p) => p.id === id);

      if (!post) {
        setError('Post not found.');
        setLoading(false);
        return;
      }

      const canEdit = isAdmin() || post.authorId === currentUser.userId;
      if (!canEdit) {
        navigate('/blogs', { replace: true });
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setLoading(false);
    }
  }, [id, isEditMode, navigate, currentUser]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Title and content are required.');
      return;
    }

    if (trimmedTitle.length > 200) {
      setError('Title must be 200 characters or fewer.');
      return;
    }

    if (trimmedContent.length > MAX_CONTENT_LENGTH) {
      setError(`Content must be ${MAX_CONTENT_LENGTH} characters or fewer.`);
      return;
    }

    const posts = getPosts();

    if (isEditMode) {
      const postIndex = posts.findIndex((p) => p.id === id);

      if (postIndex === -1) {
        setError('Post not found.');
        return;
      }

      const post = posts[postIndex];
      const canEdit = isAdmin() || post.authorId === currentUser.userId;
      if (!canEdit) {
        setError('You do not have permission to edit this post.');
        return;
      }

      posts[postIndex] = {
        ...post,
        title: trimmedTitle,
        content: trimmedContent,
        updatedAt: new Date().toISOString(),
      };

      savePosts(posts);
      navigate(`/blog/${post.id}`, { replace: true });
    } else {
      const newPost = {
        id: generateId(),
        title: trimmedTitle,
        content: trimmedContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorId: currentUser.userId,
        authorName: currentUser.displayName,
      };

      posts.unshift(newPost);
      savePosts(posts);
      navigate(`/blog/${newPost.id}`, { replace: true });
    }
  }

  function handleCancel() {
    if (isEditMode && id) {
      navigate(`/blog/${id}`);
    } else {
      navigate('/blogs');
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <p className="text-lg text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-neutral-900">
          {isEditMode ? 'Edit Post' : 'Create New Post'}
        </h1>

        {error && (
          <div className="mb-6 rounded-lg bg-danger-50 px-4 py-3 text-sm text-danger-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              maxLength={200}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 placeholder-neutral-400 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <p className="mt-1 text-xs text-neutral-500">
              {title.length}/200 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="content"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content..."
              rows={14}
              maxLength={MAX_CONTENT_LENGTH}
              className="w-full resize-y rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 placeholder-neutral-400 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <p
              className={`mt-1 text-xs ${
                content.length > MAX_CONTENT_LENGTH * 0.9
                  ? 'text-danger-500'
                  : 'text-neutral-500'
              }`}
            >
              {content.length}/{MAX_CONTENT_LENGTH} characters
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              {isEditMode ? 'Update Post' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-neutral-300 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}