/**
 * localStorage abstraction layer for WriteSpace blog platform.
 * All reads are wrapped in try/catch with safe fallbacks.
 *
 * Keys:
 *   writespace_posts   - Array<Post>
 *   writespace_users   - Array<User>
 *   writespace_session  - Session object
 */

const KEYS = {
  POSTS: 'writespace_posts',
  USERS: 'writespace_users',
  SESSION: 'writespace_session',
};

/**
 * Retrieve all posts from localStorage.
 * @returns {Array<{id: string, title: string, content: string, createdAt: string, authorId: string, authorName: string}>}
 */
export function getPosts() {
  try {
    const raw = localStorage.getItem(KEYS.POSTS);
    if (raw === null) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Save posts array to localStorage.
 * @param {Array<{id: string, title: string, content: string, createdAt: string, authorId: string, authorName: string}>} posts
 */
export function savePosts(posts) {
  try {
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
  } catch (error) {
    console.error('Failed to save posts to localStorage:', error);
  }
}

/**
 * Retrieve all users from localStorage.
 * @returns {Array<{id: string, displayName: string, username: string, password: string, role: string, createdAt: string}>}
 */
export function getUsers() {
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    if (raw === null) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Save users array to localStorage.
 * @param {Array<{id: string, displayName: string, username: string, password: string, role: string, createdAt: string}>} users
 */
export function saveUsers(users) {
  try {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users to localStorage:', error);
  }
}

/**
 * Retrieve the current session from localStorage.
 * @returns {{userId: string, username: string, displayName: string, role: string} | null}
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(KEYS.SESSION);
    if (raw === null) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Save session object to localStorage.
 * @param {{userId: string, username: string, displayName: string, role: string}} session
 */
export function saveSession(session) {
  try {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session to localStorage:', error);
  }
}

/**
 * Clear the current session from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem(KEYS.SESSION);
  } catch (error) {
    console.error('Failed to clear session from localStorage:', error);
  }
}