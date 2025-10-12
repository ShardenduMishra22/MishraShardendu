import { createAuthClient } from 'better-auth/react'

export type GoogleUser =
  | {
      id: string
      name: string
      emailVerified: boolean
      email: string
      createdAt: Date
      updatedAt: Date
      image?: string | null | undefined
    }
  | undefined

export type Session = {
  user: GoogleUser
  expires: string
} | null

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  fetchOptions: {
    credentials: 'include', // Ensure cookies are sent with requests
  },
})
