import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  login,
  register,
  logout,
  isAuthenticated,
  isAdmin,
  getCurrentUser,
} from './auth';

describe('auth utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('returns an error when username is empty', () => {
      const result = login('', 'password');
      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required.');
    });

    it('returns an error when password is empty', () => {
      const result = login('admin', '');
      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required.');
    });

    it('returns an error when both fields are empty', () => {
      const result = login('', '');
      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required.');
    });

    it('logs in successfully with hard-coded admin credentials', () => {
      const result = login('admin', 'admin');
      expect(result.success).toBe(true);
      expect(result.session).toEqual({
        userId: '0',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
    });

    it('saves admin session to localStorage on successful login', () => {
      login('admin', 'admin');
      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual({
        userId: '0',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
    });

    it('logs in successfully with a registered user', () => {
      const users = [
        {
          id: 'user1',
          displayName: 'Jane Doe',
          username: 'janedoe',
          password: 'secret123',
          role: 'user',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const result = login('janedoe', 'secret123');
      expect(result.success).toBe(true);
      expect(result.session).toEqual({
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      });
    });

    it('saves registered user session to localStorage on successful login', () => {
      const users = [
        {
          id: 'user1',
          displayName: 'Jane Doe',
          username: 'janedoe',
          password: 'secret123',
          role: 'user',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      login('janedoe', 'secret123');
      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored.userId).toBe('user1');
      expect(stored.username).toBe('janedoe');
    });

    it('returns an error for invalid username', () => {
      const result = login('nonexistent', 'password');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid username or password.');
    });

    it('returns an error for valid username but wrong password', () => {
      const users = [
        {
          id: 'user1',
          displayName: 'Jane Doe',
          username: 'janedoe',
          password: 'secret123',
          role: 'user',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const result = login('janedoe', 'wrongpassword');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid username or password.');
    });

    it('returns an error for admin username with wrong password', () => {
      const result = login('admin', 'wrongpassword');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid username or password.');
    });
  });

  describe('register', () => {
    it('registers a new user successfully', () => {
      const result = register({
        displayName: 'John Smith',
        username: 'johnsmith',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      expect(result.success).toBe(true);
      expect(result.session).toBeDefined();
      expect(result.session.username).toBe('johnsmith');
      expect(result.session.displayName).toBe('John Smith');
      expect(result.session.role).toBe('user');
      expect(result.session.userId).toBeDefined();
    });

    it('saves the new user to localStorage', () => {
      register({
        displayName: 'John Smith',
        username: 'johnsmith',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      const users = JSON.parse(localStorage.getItem('writespace_users'));
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe('johnsmith');
      expect(users[0].displayName).toBe('John Smith');
      expect(users[0].password).toBe('pass123');
      expect(users[0].role).toBe('user');
      expect(users[0].id).toBeDefined();
      expect(users[0].createdAt).toBeDefined();
    });

    it('saves session to localStorage after registration', () => {
      register({
        displayName: 'John Smith',
        username: 'johnsmith',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      const session = JSON.parse(localStorage.getItem('writespace_session'));
      expect(session).toBeDefined();
      expect(session.username).toBe('johnsmith');
      expect(session.displayName).toBe('John Smith');
      expect(session.role).toBe('user');
    });

    it('returns an error when displayName is missing', () => {
      const result = register({
        displayName: '',
        username: 'johnsmith',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required.');
    });

    it('returns an error when username is missing', () => {
      const result = register({
        displayName: 'John Smith',
        username: '',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required.');
    });

    it('returns an error when password is missing', () => {
      const result = register({
        displayName: 'John Smith',
        username: 'johnsmith',
        password: '',
        confirmPassword: 'pass123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required.');
    });

    it('returns an error when confirmPassword is missing', () => {
      const result = register({
        displayName: 'John Smith',
        username: 'johnsmith',
        password: 'pass123',
        confirmPassword: '',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required.');
    });

    it('returns an error when passwords do not match', () => {
      const result = register({
        displayName: 'John Smith',
        username: 'johnsmith',
        password: 'pass123',
        confirmPassword: 'differentpass',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Passwords do not match.');
    });

    it('returns an error when registering with the reserved admin username', () => {
      const result = register({
        displayName: 'Fake Admin',
        username: 'admin',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username already exists.');
    });

    it('returns an error when registering with the admin username in different case', () => {
      const result = register({
        displayName: 'Fake Admin',
        username: 'Admin',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username already exists.');
    });

    it('returns an error when registering with a duplicate username', () => {
      const users = [
        {
          id: 'user1',
          displayName: 'Jane Doe',
          username: 'janedoe',
          password: 'secret123',
          role: 'user',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const result = register({
        displayName: 'Another Jane',
        username: 'janedoe',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username already exists.');
    });

    it('returns an error when registering with a duplicate username in different case', () => {
      const users = [
        {
          id: 'user1',
          displayName: 'Jane Doe',
          username: 'janedoe',
          password: 'secret123',
          role: 'user',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const result = register({
        displayName: 'Another Jane',
        username: 'JaneDoe',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username already exists.');
    });

    it('appends new user to existing users in localStorage', () => {
      const existingUsers = [
        {
          id: 'user1',
          displayName: 'Jane Doe',
          username: 'janedoe',
          password: 'secret123',
          role: 'user',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(existingUsers));

      register({
        displayName: 'John Smith',
        username: 'johnsmith',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      const users = JSON.parse(localStorage.getItem('writespace_users'));
      expect(users).toHaveLength(2);
      expect(users[0].username).toBe('janedoe');
      expect(users[1].username).toBe('johnsmith');
    });
  });

  describe('logout', () => {
    it('clears the session from localStorage', () => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      logout();

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => logout()).not.toThrow();
    });

    it('does not affect other localStorage keys', () => {
      const users = [{ id: 'u1', username: 'user' }];
      localStorage.setItem('writespace_users', JSON.stringify(users));
      localStorage.setItem(
        'writespace_session',
        JSON.stringify({ userId: 'u1', username: 'user', displayName: 'User', role: 'user' })
      );

      logout();

      expect(JSON.parse(localStorage.getItem('writespace_users'))).toEqual(users);
      expect(localStorage.getItem('writespace_session')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('returns false when no session exists', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns true when a valid session exists', () => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      expect(isAuthenticated()).toBe(true);
    });

    it('returns true after a successful login', () => {
      login('admin', 'admin');
      expect(isAuthenticated()).toBe(true);
    });

    it('returns false after logout', () => {
      login('admin', 'admin');
      logout();
      expect(isAuthenticated()).toBe(false);
    });

    it('returns false when session has an empty userId', () => {
      const session = {
        userId: '',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      expect(isAuthenticated()).toBe(false);
    });

    it('returns false when session has a non-string userId', () => {
      const session = {
        userId: 123,
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('returns false when no session exists', () => {
      expect(isAdmin()).toBe(false);
    });

    it('returns true when the current session has admin role', () => {
      login('admin', 'admin');
      expect(isAdmin()).toBe(true);
    });

    it('returns false when the current session has user role', () => {
      const users = [
        {
          id: 'user1',
          displayName: 'Jane Doe',
          username: 'janedoe',
          password: 'secret123',
          role: 'user',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      login('janedoe', 'secret123');
      expect(isAdmin()).toBe(false);
    });

    it('returns false after admin logs out', () => {
      login('admin', 'admin');
      logout();
      expect(isAdmin()).toBe(false);
    });

    it('returns true when session in localStorage has admin role', () => {
      const session = {
        userId: '0',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      expect(isAdmin()).toBe(true);
    });

    it('returns false when session in localStorage has user role', () => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      expect(isAdmin()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('returns null when no session exists', () => {
      expect(getCurrentUser()).toBeNull();
    });

    it('returns the session object after admin login', () => {
      login('admin', 'admin');
      const user = getCurrentUser();
      expect(user).toEqual({
        userId: '0',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
    });

    it('returns the session object after registered user login', () => {
      const users = [
        {
          id: 'user1',
          displayName: 'Jane Doe',
          username: 'janedoe',
          password: 'secret123',
          role: 'user',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      login('janedoe', 'secret123');
      const user = getCurrentUser();
      expect(user).toEqual({
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      });
    });

    it('returns the session object after registration', () => {
      register({
        displayName: 'John Smith',
        username: 'johnsmith',
        password: 'pass123',
        confirmPassword: 'pass123',
      });

      const user = getCurrentUser();
      expect(user).toBeDefined();
      expect(user.username).toBe('johnsmith');
      expect(user.displayName).toBe('John Smith');
      expect(user.role).toBe('user');
    });

    it('returns null after logout', () => {
      login('admin', 'admin');
      logout();
      expect(getCurrentUser()).toBeNull();
    });

    it('returns the session stored directly in localStorage', () => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      expect(getCurrentUser()).toEqual(session);
    });
  });
});