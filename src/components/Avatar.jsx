import React from 'react';
import PropTypes from 'prop-types';

/**
 * Returns an avatar JSX element based on the user's role.
 * @param {string} role - The role of the user ('admin' or 'user')
 * @param {string} [size='md'] - Size variant: 'sm', 'md', or 'lg'
 * @returns {JSX.Element} Avatar element with role-appropriate emoji and background
 */
export function getAvatar(role, size = 'md') {
  const isAdmin = role === 'admin';
  const emoji = isAdmin ? '👑' : '📖';
  const bgClass = isAdmin ? 'bg-purple-500' : 'bg-blue-500';

  const sizeClasses = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-xl',
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`${bgClass} ${sizeClass} inline-flex items-center justify-center rounded-full text-white flex-shrink-0`}
      role="img"
      aria-label={isAdmin ? 'Admin avatar' : 'User avatar'}
    >
      {emoji}
    </span>
  );
}

/**
 * Avatar React component for role-based display.
 * @param {object} props
 * @param {string} props.role - 'admin' or 'user'
 * @param {string} [props.size] - 'sm', 'md', or 'lg'
 */
function Avatar({ role, size = 'md' }) {
  return getAvatar(role, size);
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

Avatar.defaultProps = {
  size: 'md',
};

export default Avatar;