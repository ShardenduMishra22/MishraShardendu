/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface User {
  id: string
  email: string
  username?: string
  name?: string
  createdAt?: string
  updatedAt?: string
}

export interface Profile {
  id: number
  userId: number
  bio?: string
  avatar?: string
  website?: string
  location?: string
  createdAt: string
  updatedAt: string
}

export interface Blog {
  id: number
  title: string
  content: string
  excerpt?: string
  published?: boolean
  authorId: string
  author: {
    id: string
    email: string
    name: string
    avatar: string
  }
  tags?: string[]
  comments?: Comment[] | number
  createdAt: string
  updatedAt: string
}

export interface CreateBlogRequest {
  title: string
  content: string
  excerpt?: string
  published?: boolean
  tags?: string[]
  authorId: string
}

export interface UpdateBlogRequest {
  title?: string
  content?: string
  excerpt?: string
  published?: boolean
  tags?: string[]
}

export interface Comment {
  id: number
  content: string
  blogId: number
  userId: string
  user?: {
    id: string
    email: string
    avatar?: string
    name?: string
  }
  userProfile?: {
    firstName?: string
    lastName?: string
    avatar?: string
  }
  createdAt: string
  updatedAt?: string
}

export interface CreateCommentRequest {
  content: string
  userId: string
  blogId?: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  tag?: string
  author?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
