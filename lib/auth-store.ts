export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
}

export interface AuthSession {
  userId: string
  email: string
  name: string
  loginAt: string
}

const USERS_KEY = "pathfinder_users"
const SESSION_KEY = "pathfinder_session"

function simpleHash(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash + char) | 0
  }
  return btoa(String(hash) + ":" + password.length + ":" + password.split("").reverse().join(""))
}

function getUsers(): User[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function registerUser(
  name: string,
  email: string,
  password: string
): { success: boolean; error?: string; user?: AuthSession } {
  const users = getUsers()
  const normalizedEmail = email.toLowerCase().trim()

  if (users.some((u) => u.email === normalizedEmail)) {
    return { success: false, error: "An account with this email already exists." }
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." }
  }

  if (!name.trim()) {
    return { success: false, error: "Name is required." }
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: simpleHash(password),
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  const session: AuthSession = {
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
    loginAt: new Date().toISOString(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))

  return { success: true, user: session }
}

export function loginUser(
  email: string,
  password: string
): { success: boolean; error?: string; user?: AuthSession } {
  const users = getUsers()
  const normalizedEmail = email.toLowerCase().trim()
  const user = users.find((u) => u.email === normalizedEmail)

  if (!user) {
    return { success: false, error: "No account found with this email." }
  }

  if (user.passwordHash !== simpleHash(password)) {
    return { success: false, error: "Incorrect password. Please try again." }
  }

  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    loginAt: new Date().toISOString(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))

  return { success: true, user: session }
}

export function getCurrentUser(): AuthSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
}
