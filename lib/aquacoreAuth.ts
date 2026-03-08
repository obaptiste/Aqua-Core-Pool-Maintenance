export interface AcademyUser {
  name: string;
  email: string;
  password: string;
}

const USERS_KEY = 'aquacore-users';
const SESSION_KEY = 'aquacore-session';

const canUseStorage = () => typeof window !== 'undefined';

export function getRegisteredUsers(): AcademyUser[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];

  const parsed = JSON.parse(raw) as AcademyUser[];
  return Array.isArray(parsed) ? parsed : [];
}

export function registerUser(user: AcademyUser): { ok: boolean; message: string } {
  const users = getRegisteredUsers();
  const exists = users.some((existing) => existing.email.toLowerCase() === user.email.toLowerCase());

  if (exists) {
    return { ok: false, message: 'An account with that email already exists.' };
  }

  if (!canUseStorage()) {
    return { ok: false, message: 'Storage is not available in this environment.' };
  }

  const nextUsers = [...users, user];
  window.localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));

  return { ok: true, message: 'Account created successfully.' };
}

export function loginUser(email: string, password: string): { ok: boolean; message: string } {
  const user = getRegisteredUsers().find(
    (existing) => existing.email.toLowerCase() === email.toLowerCase() && existing.password === password,
  );

  if (!user) {
    return { ok: false, message: 'Invalid email or password.' };
  }

  if (!canUseStorage()) {
    return { ok: false, message: 'Storage is not available in this environment.' };
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
  return { ok: true, message: 'Signed in successfully.' };
}

export function getSessionUser(): Pick<AcademyUser, 'name' | 'email'> | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as Pick<AcademyUser, 'name' | 'email'>;
}

export function logoutUser() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SESSION_KEY);
}
