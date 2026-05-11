import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getPosts,
  savePosts,
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  clearSession,
} from './storage';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getPosts', () => {
    it('returns an empty array when no posts exist in localStorage', () => {
      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns parsed posts array from localStorage', () => {
      const posts = [
        {
          id: 'abc123',
          title: 'Test Post',
          content: 'Hello world',
          createdAt: '2024-01-15T10:30:00.000Z',
          authorId: 'user1',
          authorName: 'Jane Doe',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      const result = getPosts();
      expect(result).toEqual(posts);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Post');
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_posts', '{not valid json');

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify({ key: 'value' }));

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains a string value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify('just a string'));

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const result = getPosts();
      expect(result).toEqual([]);
    });
  });

  describe('savePosts', () => {
    it('saves posts array to localStorage', () => {
      const posts = [
        {
          id: 'abc123',
          title: 'Test Post',
          content: 'Content here',
          createdAt: '2024-01-15T10:30:00.000Z',
          authorId: 'user1',
          authorName: 'Jane Doe',
        },
      ];

      savePosts(posts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(posts);
    });

    it('overwrites existing posts in localStorage', () => {
      const oldPosts = [{ id: 'old', title: 'Old Post' }];
      const newPosts = [{ id: 'new', title: 'New Post' }];

      savePosts(oldPosts);
      savePosts(newPosts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(newPosts);
      expect(stored).toHaveLength(1);
    });

    it('saves an empty array without error', () => {
      savePosts([]);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual([]);
    });

    it('does not throw when localStorage.setItem fails', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => savePosts([{ id: '1' }])).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save posts to localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('getUsers', () => {
    it('returns an empty array when no users exist in localStorage', () => {
      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns parsed users array from localStorage', () => {
      const users = [
        {
          id: 'user1',
          displayName: 'Jane Doe',
          username: 'janedoe',
          password: 'hashed123',
          role: 'admin',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
        {
          id: 'user2',
          displayName: 'John Smith',
          username: 'johnsmith',
          password: 'hashed456',
          role: 'user',
          createdAt: '2024-01-16T08:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const result = getUsers();
      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
      expect(result[0].role).toBe('admin');
      expect(result[1].role).toBe('user');
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_users', 'broken{json');

      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_users', JSON.stringify(42));

      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const result = getUsers();
      expect(result).toEqual([]);
    });
  });

  describe('saveUsers', () => {
    it('saves users array to localStorage', () => {
      const users = [
        {
          id: 'user1',
          displayName: 'Jane Doe',
          username: 'janedoe',
          password: 'hashed123',
          role: 'admin',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
      ];

      saveUsers(users);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(users);
    });

    it('saves an empty array without error', () => {
      saveUsers([]);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual([]);
    });

    it('does not throw when localStorage.setItem fails', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => saveUsers([{ id: '1' }])).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save users to localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('getSession', () => {
    it('returns null when no session exists in localStorage', () => {
      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns parsed session object from localStorage', () => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toEqual(session);
      expect(result.userId).toBe('user1');
      expect(result.role).toBe('admin');
    });

    it('returns null when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_session', 'not-json');

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage contains an array', () => {
      localStorage.setItem('writespace_session', JSON.stringify([1, 2, 3]));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage contains a primitive value', () => {
      localStorage.setItem('writespace_session', JSON.stringify('just a string'));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage contains null', () => {
      localStorage.setItem('writespace_session', JSON.stringify(null));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const result = getSession();
      expect(result).toBeNull();
    });
  });

  describe('saveSession', () => {
    it('saves session object to localStorage', () => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'admin',
      };

      saveSession(session);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(session);
    });

    it('overwrites existing session in localStorage', () => {
      const oldSession = { userId: 'user1', username: 'old', displayName: 'Old', role: 'user' };
      const newSession = { userId: 'user2', username: 'new', displayName: 'New', role: 'admin' };

      saveSession(oldSession);
      saveSession(newSession);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(newSession);
    });

    it('does not throw when localStorage.setItem fails', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => saveSession({ userId: '1' })).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save session to localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('clearSession', () => {
    it('removes session from localStorage', () => {
      const session = {
        userId: 'user1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      clearSession();

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });

    it('does not affect other localStorage keys', () => {
      const posts = [{ id: '1', title: 'Post' }];
      const users = [{ id: 'u1', username: 'user' }];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));
      localStorage.setItem('writespace_users', JSON.stringify(users));
      localStorage.setItem('writespace_session', JSON.stringify({ userId: 'u1' }));

      clearSession();

      expect(JSON.parse(localStorage.getItem('writespace_posts'))).toEqual(posts);
      expect(JSON.parse(localStorage.getItem('writespace_users'))).toEqual(users);
      expect(localStorage.getItem('writespace_session')).toBeNull();
    });

    it('does not throw when localStorage.removeItem fails', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      expect(() => clearSession()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to clear session from localStorage:',
        expect.any(Error)
      );
    });
  });
});