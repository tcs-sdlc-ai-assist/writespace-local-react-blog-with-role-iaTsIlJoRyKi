import { useState } from 'react';
import { getAvatar } from './Avatar.jsx';

/**
 * UserRow component for admin user management.
 * Displays user info with avatar, role badge, and delete action.
 *
 * @param {object} props
 * @param {object} props.user - The user object to display
 * @param {string} props.user.id - User unique ID
 * @param {string} props.user.displayName - User display name
 * @param {string} props.user.username - User username
 * @param {string} props.user.role - User role ('admin' or 'user')
 * @param {string} props.user.createdAt - ISO date string of account creation
 * @param {string} props.currentUserId - The currently logged-in user's ID
 * @param {function} props.onDelete - Callback invoked with user ID when delete is confirmed
 */
function UserRow({ user, currentUserId, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const isHardCodedAdmin = user.id === '0' && user.username === 'admin';
  const isSelf = user.id === currentUserId;
  const deleteDisabled = isHardCodedAdmin || isSelf;

  function formatDate(isoString) {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString || '—';
    }
  }

  function handleDeleteClick() {
    setConfirmingDelete(true);
  }

  function handleConfirm() {
    setConfirmingDelete(false);
    if (onDelete) {
      onDelete(user.id);
    }
  }

  function handleCancel() {
    setConfirmingDelete(false);
  }

  const roleBadge =
    user.role === 'admin' ? (
      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
        User
      </span>
    );

  let deleteTooltip = '';
  if (isHardCodedAdmin) {
    deleteTooltip = 'Cannot delete the default admin account';
  } else if (isSelf) {
    deleteTooltip = 'Cannot delete your own account';
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg">
      <div className="flex items-center gap-4">
        {getAvatar(user.role, 'md')}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user.displayName}
            </p>
            {roleBadge}
          </div>
          <p className="truncate text-sm text-gray-500">@{user.username}</p>
          <p className="text-xs text-gray-400">
            Joined {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        {confirmingDelete ? (
          <>
            <span className="text-sm text-gray-600">Delete?</span>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-md bg-danger-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-1"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={deleteDisabled}
            title={deleteTooltip}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              deleteDisabled
                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                : 'bg-danger-50 text-danger-700 hover:bg-danger-500 hover:text-white focus:ring-danger-500'
            }`}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default UserRow;