import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, saveUsers } from '../utils/storage.js';
import { getCurrentUser, isAdmin } from '../utils/auth.js';
import UserRow from '../components/UserRow.jsx';

/**
 * Generate a simple unique ID.
 * @returns {string} A unique identifier string
 */
function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10);
}

/**
 * Admin-only user management page.
 * Displays a form to create new users and a list of all users with delete capability.
 */
export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/blogs', { replace: true });
      return;
    }
    setSession(currentUser);
    setUsers(getUsers());
  }, [navigate]);

  if (!session || !isAdmin()) {
    return null;
  }

  /**
   * Hard-coded admin user object for display purposes.
   */
  const hardCodedAdmin = {
    id: '0',
    displayName: 'Admin',
    username: 'admin',
    role: 'admin',
    createdAt: '2024-01-15T00:00:00.000Z',
  };

  /** All users including the hard-coded admin, displayed in the list. */
  const allUsers = [hardCodedAdmin, ...users];

  function handleCreateUser(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setFormError('All fields are required.');
      return;
    }

    if (trimmedUsername.length < 3) {
      setFormError('Username must be at least 3 characters.');
      return;
    }

    if (trimmedPassword.length < 3) {
      setFormError('Password must be at least 3 characters.');
      return;
    }

    // Check against hard-coded admin username
    if (trimmedUsername.toLowerCase() === 'admin') {
      setFormError('Username already exists.');
      return;
    }

    // Check against existing registered users (case-insensitive)
    const currentUsers = getUsers();
    const duplicate = currentUsers.find(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (duplicate) {
      setFormError('Username already exists.');
      return;
    }

    const newUser = {
      id: generateId(),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: role,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...currentUsers, newUser];
    saveUsers(updatedUsers);
    setUsers(updatedUsers);

    // Reset form
    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setFormSuccess(`User "${newUser.displayName}" created successfully.`);
  }

  function handleDeleteUser(userId) {
    const currentUsers = getUsers();
    const updatedUsers = currentUsers.filter((u) => u.id !== userId);
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create new users and manage existing accounts.
          </p>
        </div>

        {/* Create User Form */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Create New User</h2>

          {formError && (
            <div
              className="mb-4 rounded-md bg-danger-50 px-4 py-3 text-sm text-danger-700"
              role="alert"
            >
              {formError}
            </div>
          )}

          {formSuccess && (
            <div
              className="mb-4 rounded-md bg-success-50 px-4 py-3 text-sm text-success-700"
              role="alert"
            >
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="displayName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="janedoe"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* User List */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            All Users ({allUsers.length})
          </h2>

          {allUsers.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-md">
              <p className="text-gray-500">No users found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  currentUserId={session.userId}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}