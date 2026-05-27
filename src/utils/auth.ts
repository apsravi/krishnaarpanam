// Simple PIN authentication
// PIN is stored as a salted SHA-256 hash — never plain text
// Lockout after 3 failed attempts (15 min cooldown)

const PIN_KEY      = 'ka_pin_hash'
const ATTEMPTS_KEY = 'ka_pin_attempts'
const LOCKOUT_KEY  = 'ka_pin_lockout'
const SESSION_KEY  = 'ka_session'
const MAX_ATTEMPTS = 3
const LOCKOUT_MS   = 15 * 60 * 1000   // 15 minutes
const SESSION_MS   = 8  * 60 * 60 * 1000  // 8 hours

// Simple salt — makes rainbow-table attacks infeasible for a 4-digit PIN
const SALT = 'krishnaarpanam-guruvayurappan-2026'

async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode(SALT + pin)
  const buf  = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function isPinSet(): boolean {
  return !!localStorage.getItem(PIN_KEY)
}

export async function setPin(pin: string): Promise<void> {
  const hash = await hashPin(pin)
  localStorage.setItem(PIN_KEY, hash)
  // Clear any stale lockout
  localStorage.removeItem(ATTEMPTS_KEY)
  localStorage.removeItem(LOCKOUT_KEY)
}

export function isLockedOut(): { locked: boolean; remainingMs: number } {
  const lockoutUntil = Number(localStorage.getItem(LOCKOUT_KEY) || 0)
  const now = Date.now()
  if (lockoutUntil > now) return { locked: true, remainingMs: lockoutUntil - now }
  return { locked: false, remainingMs: 0 }
}

export function getFailedAttempts(): number {
  return Number(localStorage.getItem(ATTEMPTS_KEY) || 0)
}

export async function verifyPin(pin: string): Promise<{ ok: boolean; attemptsLeft: number; locked: boolean }> {
  const { locked } = isLockedOut()
  if (locked) return { ok: false, attemptsLeft: 0, locked: true }

  const stored = localStorage.getItem(PIN_KEY)
  if (!stored) return { ok: false, attemptsLeft: MAX_ATTEMPTS, locked: false }

  const hash = await hashPin(pin)
  if (hash === stored) {
    // Success — clear attempts, create session
    localStorage.removeItem(ATTEMPTS_KEY)
    localStorage.removeItem(LOCKOUT_KEY)
    localStorage.setItem(SESSION_KEY, String(Date.now() + SESSION_MS))
    return { ok: true, attemptsLeft: MAX_ATTEMPTS, locked: false }
  }

  // Failed — increment attempts
  const attempts = getFailedAttempts() + 1
  localStorage.setItem(ATTEMPTS_KEY, String(attempts))

  if (attempts >= MAX_ATTEMPTS) {
    localStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_MS))
    localStorage.removeItem(ATTEMPTS_KEY)
    return { ok: false, attemptsLeft: 0, locked: true }
  }

  return { ok: false, attemptsLeft: MAX_ATTEMPTS - attempts, locked: false }
}

export function isSessionValid(): boolean {
  const exp = Number(localStorage.getItem(SESSION_KEY) || 0)
  return Date.now() < exp
}

export function signOut(): void {
  localStorage.removeItem(SESSION_KEY)
}

export async function changePin(oldPin: string, newPin: string): Promise<{ ok: boolean; error?: string }> {
  const result = await verifyPin(oldPin)
  if (!result.ok) return { ok: false, error: 'Current PIN is incorrect' }
  if (newPin.length < 4) return { ok: false, error: 'PIN must be at least 4 digits' }
  await setPin(newPin)
  return { ok: true }
}
