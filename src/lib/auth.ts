// Secure-ish client-side auth for a frontend-only app.
// Passwords are hashed with Web Crypto SHA-256 (salted). A real backend would
// be required for true security; this keeps credentials out of plaintext storage
// and gates the admin area behind role + an expiring session token.

export type UserRole = "admin" | "user"

export type User = {
  id: string
  name: string
  email: string
  passwordHash: string
  role: UserRole
  createdAt: string
  status: "active" | "blocked"
}

export type Session = {
  userId: string
  email: string
  name: string
  role: UserRole
  exp: number // epoch ms
}

const USERS_KEY = "paryatan_users_v1"
const SESSION_KEY = "paryatan_session_v1"
const SESSION_TTL = 1000 * 60 * 60 * 8 // 8h
const SEEDING_KEY = "paryatan_seeding_v1"

const APP_SALT = "paryatan-holidays::v1::7f3c9a"

const DEFAULT_ADMIN = {
  email: "admin@paryatan.co.in",
  password: "admin123",
  name: "Paryatan Admin",
}

function uid() {
  return "u_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

async function hashPassword(password: string, email: string): Promise<string> {
  const data = APP_SALT + "::" + email.toLowerCase() + "::" + password
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function loadUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  } catch {
    return []
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Seed the default admin on first run.
export function ensureSeeded() {
  const users = loadUsers()
  if (users.length === 0 && !localStorage.getItem(SEEDING_KEY)) {
    localStorage.setItem(SEEDING_KEY, "1")
    void hashPassword(DEFAULT_ADMIN.password, DEFAULT_ADMIN.email).then((hash) => {
      const admin: User = {
        id: uid(),
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        passwordHash: hash,
        role: "admin",
        createdAt: new Date().toISOString(),
        status: "active",
      }
      saveUsers([admin])
      localStorage.removeItem(SEEDING_KEY)
    })
  }
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export type RegisterResult = { ok: true; user: User } | { ok: false; error: string }

export async function registerUser(input: {
  name: string
  email: string
  password: string
}): Promise<RegisterResult> {
  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  const password = input.password

  if (name.length < 2) return { ok: false, error: "Please enter your full name." }
  if (!isValidEmail(email)) return { ok: false, error: "Please enter a valid email address." }
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." }

  const users = loadUsers()
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: "An account with this email already exists." }
  }

  const user: User = {
    id: uid(),
    name,
    email,
    passwordHash: await hashPassword(password, email),
    role: "user",
    createdAt: new Date().toISOString(),
    status: "active",
  }
  saveUsers([user, ...users])
  return { ok: true, user }
}

export type LoginResult =
  | { ok: true; user: User }
  | { ok: false; error: string }

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  const normalized = email.trim().toLowerCase()
  if (!normalized || !password) return { ok: false, error: "Email and password are required." }

  const user = loadUsers().find((u) => u.email === normalized)
  if (!user) return { ok: false, error: "Invalid credentials." }

  const hash = await hashPassword(password, user.email)
  if (hash !== user.passwordHash) return { ok: false, error: "Invalid credentials." }
  if (user.status === "blocked") return { ok: false, error: "This account has been disabled." }

  const session: Session = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + SESSION_TTL,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { ok: true, user }
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as Session
    if (!s.exp || Date.now() > s.exp) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return s
  } catch {
    return null
  }
}

export function getCurrentUser(): User | null {
  const s = getSession()
  if (!s) return null
  return loadUsers().find((u) => u.id === s.userId) || null
}

export function isAdmin(): boolean {
  return getSession()?.role === "admin"
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function listUsers(): User[] {
  return loadUsers()
}

export function setUserStatus(id: string, status: "active" | "blocked") {
  const users = loadUsers().map((u) => (u.id === id ? { ...u, status } : u))
  saveUsers(users)
}

export function deleteUser(id: string) {
  saveUsers(loadUsers().filter((u) => u.id !== id))
}

export function updateUser(id: string, patch: Partial<Pick<User, "name" | "role">>) {
  const users = loadUsers().map((u) => (u.id === id ? { ...u, ...patch } : u))
  saveUsers(users)
}

export async function updateUserPassword(id: string, currentPassword: string, newPassword: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const users = loadUsers()
  const user = users.find((u) => u.id === id)
  if (!user) return { ok: false, error: "User not found." }

  const currentHash = await hashPassword(currentPassword, user.email)
  if (currentHash !== user.passwordHash) return { ok: false, error: "Current password is incorrect." }

  if (newPassword.length < 6) return { ok: false, error: "New password must be at least 6 characters." }

  user.passwordHash = await hashPassword(newPassword, user.email)
  saveUsers(users)
  return { ok: true }
}
