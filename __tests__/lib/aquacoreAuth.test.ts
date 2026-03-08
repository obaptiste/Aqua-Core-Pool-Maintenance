import { beforeEach, describe, expect, it } from 'vitest';
import {
  getRegisteredUsers,
  getSessionUser,
  loginUser,
  logoutUser,
  registerUser,
} from '@/lib/aquacoreAuth';

describe('aquacoreAuth', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('registers a new user and creates a session', () => {
    const result = registerUser({
      name: 'Pool Operator',
      email: 'operator@example.com',
      password: 'Secret123',
    });

    expect(result.ok).toBe(true);
    expect(getRegisteredUsers()).toHaveLength(1);
    expect(getSessionUser()).toEqual({ name: 'Pool Operator', email: 'operator@example.com' });
  });

  it('prevents duplicate registration by email', () => {
    registerUser({ name: 'One', email: 'operator@example.com', password: 'Secret123' });

    const duplicate = registerUser({ name: 'Two', email: 'OPERATOR@example.com', password: 'NewPass' });
    expect(duplicate.ok).toBe(false);
    expect(getRegisteredUsers()).toHaveLength(1);
  });

  it('allows login and logout flow', () => {
    registerUser({ name: 'One', email: 'operator@example.com', password: 'Secret123' });
    logoutUser();

    const badLogin = loginUser('operator@example.com', 'wrong');
    expect(badLogin.ok).toBe(false);

    const success = loginUser('operator@example.com', 'Secret123');
    expect(success.ok).toBe(true);
    expect(getSessionUser()).toEqual({ name: 'One', email: 'operator@example.com' });

    logoutUser();
    expect(getSessionUser()).toBeNull();
  });
});
