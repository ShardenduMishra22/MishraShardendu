// Utility to resolve image URLs coming from backend. If the backend returns a
// relative path (e.g. "/uploads/img.png" or "uploads/img.png"), this will
// prefix it with VITE_API_URL. If the path is already absolute, it will be
// returned as-is. Returns undefined when no path is provided.
const API_URL = import.meta.env.VITE_API_URL || ''

export const resolveImageUrl = (path?: string | null | undefined): string | undefined => {
  if (!path) return undefined
  // If already absolute (starts with http://, https:// or //), return as-is
  if (/^(https?:)?\/\//i.test(path)) return path
  const base = API_URL.replace(/\/$/, '')
  return `${base}/${path.replace(/^\//, '')}`
}

export default resolveImageUrl
