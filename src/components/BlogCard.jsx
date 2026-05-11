import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getAvatar } from './Avatar.jsx';
import { getCurrentUser } from '../utils/auth.js';

/**
 * Truncate content to a specified maximum length and append ellipsis.
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum character length
 * @returns {string} Truncated text with ellipsis if needed
 */
function truncate(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
}

/**
 * Format an ISO date string to a human-readable format.
 * @param {string} dateString - ISO 8601 date string
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * BlogCard component displays a blog post preview in a card layout.
 * Shows title, truncated content excerpt, author info with avatar,
 * formatted date, and an edit icon if the current user owns the post or is admin.
 *
 * @param {object} props
 * @param {object} props.post - The blog post object
 * @param {string} props.post.id - Unique post identifier
 * @param {string} props.post.title - Post title
 * @param {string} props.post.content - Post content (will be truncated)
 * @param {string} props.post.createdAt - ISO date string
 * @param {string} props.post.authorId - Author's user ID
 * @param {string} props.post.authorName - Author's display name
 */
function BlogCard({ post }) {
  const currentUser = getCurrentUser();

  const canEdit =
    currentUser &&
    (currentUser.role === 'admin' || currentUser.userId === post.authorId);

  const authorRole =
    currentUser && currentUser.userId === post.authorId
      ? currentUser.role
      : 'user';

  return (
    <div className="flex flex-col rounded-lg bg-white shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            {formatDate(post.createdAt)}
          </span>
          {canEdit && (
            <Link
              to={`/edit/${post.id}`}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
              aria-label={`Edit post: ${post.title}`}
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Link>
          )}
        </div>

        <Link to={`/blog/${post.id}`} className="group flex-1">
          <h3 className="mb-2 text-lg font-bold text-neutral-900 transition-colors group-hover:text-primary-600">
            {post.title}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-neutral-600">
            {truncate(post.content, 150)}
          </p>
        </Link>

        <div className="mt-auto flex items-center gap-3 border-t border-neutral-100 pt-4">
          {getAvatar(authorRole, 'sm')}
          <span className="text-sm font-medium text-neutral-700">
            {post.authorName}
          </span>
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
  }).isRequired,
};

export default BlogCard;