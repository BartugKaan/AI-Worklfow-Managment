/**
 * Authentication utilities for JWT token handling and password hashing
 */

import bcrypt from 'bcryptjs'


const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

/**
 * Create JWT token using Web Crypto API
 */
export async function createToken(payload: { userId: string; email: string }): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + (7 * 24 * 60 * 60) // 7 days
  }

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const encodedPayload = btoa(JSON.stringify(tokenPayload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  
  const data = `${encodedHeader}.${encodedPayload}`
  const signature = await crypto.subtle.sign(
    'HMAC',
    await crypto.subtle.importKey('raw', JWT_SECRET, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
    new TextEncoder().encode(data)
  )
  
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  
  return `${data}.${encodedSignature}`
}

/**
 * Verify JWT token using Web Crypto API
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.')
    if (!headerB64 || !payloadB64 || !signatureB64) {
      throw new Error('Invalid token format')
    }

    // Verify signature
    const data = `${headerB64}.${payloadB64}`
    const signature = Uint8Array.from(atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      await crypto.subtle.importKey('raw', JWT_SECRET, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']),
      signature,
      new TextEncoder().encode(data)
    )

    if (!isValid) {
      throw new Error('Invalid signature')
    }

    // Decode payload
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))) as JWTPayload
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired')
    }

    return payload
  } catch (error) {
    throw new Error('Invalid token')
  }
}


export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}


export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
