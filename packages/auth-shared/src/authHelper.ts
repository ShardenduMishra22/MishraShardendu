import { db } from '../db'
import { session, user } from '../db/authSchema'
import { eq } from 'drizzle-orm'
import type { APIContext } from 'astro'

const OWNER_EMAIL = 'mishrashardendu22@gmail.com'

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  image: string | null
  isOwner: boolean
}

/**
 * Get session token from request cookies
 */
function getSessionToken(context: APIContext): string | null {
  // Check better-auth session cookie
  const sessionCookie = context.cookies.get('better-auth.session_token')
  
  if (!sessionCookie?.value) {
    return null
  }
  
  // better-auth stores tokens in format: BASE_TOKEN.SIGNATURE
  // The database only stores the BASE_TOKEN part
  const fullToken = sessionCookie.value
  const baseToken = fullToken.split('.')[0]
  
  return baseToken
}

/**
 * Verify session and get authenticated user
 * @returns User object if authenticated, null otherwise
 */
export async function getAuthenticatedUser(
  context: APIContext
): Promise<AuthenticatedUser | null> {
  try {
    const token = getSessionToken(context)
    
    if (!token) {
      return null
    }

    // Query session and join with user
    const [sessionData] = await db
      .select({
        userId: session.userId,
        expiresAt: session.expiresAt,
        email: user.email,
        name: user.name,
        image: user.image,
        id: user.id,
      })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .where(eq(session.token, token))
      .limit(1)

    if (!sessionData) {
      return null
    }

    // Check if session is expired
    if (new Date(sessionData.expiresAt) < new Date()) {
      return null
    }

    return {
      id: sessionData.id,
      email: sessionData.email,
      name: sessionData.name,
      image: sessionData.image,
      isOwner: sessionData.email === OWNER_EMAIL,
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error verifying session:', error)
    return null
  }
}

/**
 * Require authentication - returns user or throws 401
 */
export async function requireAuth(context: APIContext): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(context)
  
  if (!user) {
    throw new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
  
  return user
}

/**
 * Require owner authentication - returns owner user or throws 403
 */
export async function requireOwner(context: APIContext): Promise<AuthenticatedUser> {
  const user = await requireAuth(context)
  
  if (!user.isOwner) {
    throw new Response(
      JSON.stringify({ success: false, error: 'Forbidden - Owner access required' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
  
  return user
}

/**
 * Check if user owns a resource
 */
export function checkOwnership(
  authenticatedUserId: string,
  resourceOwnerId: string
): boolean {
  return authenticatedUserId === resourceOwnerId
}
