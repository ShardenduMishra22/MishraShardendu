import type { ApiResponse, Blog, CreateBlogRequest, UpdateBlogRequest, PaginationParams, Comment } from '../types'
import axios from 'axios'

const localAPI = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
})

export const blogsService = {
  getBlogs: async (params?: PaginationParams): Promise<ApiResponse<Blog[]>> => {
    const response = await localAPI.get('/blogs', { params })
    return response.data
  },

  getBlogById: async (id: string): Promise<ApiResponse<Blog>> => {
    const response = await localAPI.get(`/blogs/${id}`)
    return response.data
  },

  createBlog: async (blogData: CreateBlogRequest): Promise<ApiResponse<Blog>> => {
    const response = await localAPI.post('/blogs', blogData)
    return response.data
  },

  updateBlog: async (id: string, blogData: UpdateBlogRequest): Promise<ApiResponse<Blog>> => {
    const response = await localAPI.put(`/blogs/${id}`, blogData)
    return response.data
  },

  deleteBlog: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.delete(`/blogs/${id}`)
    return response.data
  },

  getBlogComments: async (id: string, params?: PaginationParams): Promise<ApiResponse<Comment[]>> => {
    const response = await localAPI.get(`/blogs/${id}/comments`, { params })
    return response.data
  },

  addBlogComment: async (
    id: string,
    commentData: { content: string; userId: string }
  ): Promise<ApiResponse<Comment>> => {
    const response = await localAPI.post(`/blogs/${id}/comments`, commentData)
    return response.data
  },

  deleteBlogComment: async (blogId: string, commentId: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.delete(`/blogs/${blogId}/comments/${commentId}`)
    return response.data
  },

  getBlogStats: async (): Promise<ApiResponse<{
    totalPosts: number
    totalComments: number
    averageCommentsPerPost: number
    recentPosts: Blog[]
    authorStats: Array<{
      authorId: string
      authorEmail: string | null
      authorName: string | null
      firstName: string | null
      lastName: string | null
      avatar: string | null
      postCount: number
    }>
    tagStats: Array<{
      tag: string
      count: number
    }>
  }>> => {
    const response = await localAPI.get('/blogs/stats')
    return response.data
  },
}
