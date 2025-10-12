'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { BookOpen, Plus, Search } from 'lucide-react'
import { blogsService } from '../../services/blogs'
import type { Blog } from '../../services/types'
import { authClient } from '../../lib/authClient'
import BlogCard from './BlogCard'

const OWNER_EMAIL = 'mishrashardendu22@gmail.com'

const BlogListPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const session = authClient.useSession()

  // Check if current user is the owner
  const isOwner = useMemo(() => {
    return session?.data?.user?.email === OWNER_EMAIL
  }, [session?.data?.user?.email])

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await blogsService.getBlogs()

      if (response.success && response.data) {
        setBlogs(Array.isArray(response.data) ? response.data : [])
      } else {
        setError(response.error || 'Failed to fetch blogs')
      }
    } catch {
      setError('Failed to load blogs')
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const showLoadingSkeleton = initialLoad && loading && blogs.length === 0

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Search and Create Post Section */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5 pointer-events-none z-10" />
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 sm:pl-12 pr-20 sm:pr-24 h-11 sm:h-12 bg-card/60 backdrop-blur-sm border-border/60 focus:border-primary/40 hover:border-border focus:ring-2 focus:ring-primary/10 rounded-xl text-sm sm:text-base text-foreground placeholder:text-muted-foreground transition-all duration-300 shadow-sm w-full"
          />
          <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <span className="text-xs font-semibold bg-primary/15 text-primary px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-primary/30 shadow-sm whitespace-nowrap">
              {filteredBlogs.length}
            </span>
          </div>
        </div>
        
        {isOwner && (
          <Button
            onClick={() => window.location.href = '/blog/create'}
            className="h-11 sm:h-12 px-4 sm:px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl shadow-primary/20 transition-all duration-300 gap-2 rounded-xl text-sm sm:text-base flex-shrink-0 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Create Post</span>
            <span className="xs:hidden">Create</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-6 md:mb-8 p-4 md:p-5 bg-destructive/10 border border-destructive/30 rounded-xl max-w-xl mx-auto shadow-sm">
          <p className="text-destructive text-sm text-center font-medium">{error}</p>
        </div>
      )}

      {showLoadingSkeleton ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm p-4 space-y-4"
            >
              <div className="w-10 h-10 bg-muted/50 rounded-full animate-pulse" />
              <div className="h-5 w-5/6 bg-muted/50 rounded animate-pulse" />
              <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-muted/50 rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-muted/50 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12 sm:py-16 md:py-24 px-4">
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 rounded-3xl blur-2xl animate-pulse"></div>
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/5 rounded-3xl flex items-center justify-center shadow-xl border border-primary/10">
              <BookOpen className="w-10 h-10 sm:w-14 sm:h-14 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mb-3 sm:mb-4">
            {searchTerm ? 'No blogs found' : 'No blogs yet'}
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed px-4">
            {searchTerm
              ? 'Try adjusting your search terms or browse all blogs'
              : 'Create your first blog post to share your thoughts and insights with the world'}
          </p>
          {!searchTerm && isOwner && (
            <Button
              onClick={() => window.location.href = '/blog/create'}
              className="h-11 sm:h-12 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl shadow-primary/20 transition-all duration-300 gap-2 sm:gap-2.5 rounded-xl text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Create First Post
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onReadMore={(blogId) => window.location.href = `/blog/${blogId}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default BlogListPage
