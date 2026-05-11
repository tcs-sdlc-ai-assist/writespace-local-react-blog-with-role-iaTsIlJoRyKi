import { getUsers, saveUsers, getSession, saveSession, clearSession } from './storage.js';

/**
 * Generate a simple unique ID.
 * @returns {string} A unique identifier string
 */
function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10);
}

/**
 * Hard-coded admin credentials.
 */
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

/**
 * Attempt to log in a user with the given credentials.
 * Checks hard-coded admin first, then registered users in localStorage.
 *
 * @param {string} username - The username to authenticate
 * @param {string} password - The password to authenticate
 * @returns {{ success: boolean, error?: string, session?: { userId: string, username: string, displayName: string, role: string } }}
 */
export function login(username, password) {
  if (!username || !password) {
    return { success: false, error: 'All fields are required.' };
  }

  // Check hard-coded admin credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const session = {
      userId: '0',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
    };
    saveSession(session);
    return { success: true, session };
  }

  // Check registered users
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return { success: false, error: 'Invalid username or password.' };
  }

  const session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };
  saveSession(session);
  return { success: true, session };
}

/**
 * Register a new user account.
 * Validates all fields, checks for duplicate usernames (case-insensitive),
 * and prevents registration with the reserved 'admin' username.
 *
 * @param {{ displayName: string, username: string, password: string, confirmPassword: string }} params
 * @returns {{ success: boolean, error?: string, session?: { userId: string, username: string, displayName: string, role: string } }}
 */
export function register({ displayName, username, password, confirmPassword }) {
  if (!displayName || !username || !password || !confirmPassword) {
    return { success: false, error: 'All fields are required.' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' };
  }

  // Prevent registration with the reserved admin username
  if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase()) {
    return { success: false, error: 'Username already exists.' };
  }

  const users = getUsers();
  const duplicate = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );

  if (duplicate) {
    return { success: false, error: 'Username already exists.' };
  }

  const newUser = {
    id: generateId(),
    displayName,
    username,
    password,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const session = {
    userId: newUser.id,
    username: newUser.username,
    displayName: newUser.displayName,
    role: newUser.role,
  };
  saveSession(session);
  return { success: true, session };
}

/**
 * Log out the current user by clearing the session from localStorage.
 */
export function logout() {
  clearSession();
}

/**
 * Check if a user is currently authenticated.
 * @returns {boolean} True if a valid session exists in localStorage
 */
export function isAuthenticated() {
  const session = getSession();
  return session !== null && typeof session.userId === 'string' && session.userId.length > 0;
}

/**
 * Check if the current authenticated user has the admin role.
 * @returns {boolean} True if the current session has role 'admin'
 */
export function isAdmin() {
  const session = getSession();
  if (!session) {
    return false;
  }
  return session.role === 'admin';
}

/**
 * Get the current authenticated user's session data.
 * @returns {{ userId: string, username: string, displayName: string, role: string } | null}
 */
export function getCurrentUser() {
  return getSession();
}