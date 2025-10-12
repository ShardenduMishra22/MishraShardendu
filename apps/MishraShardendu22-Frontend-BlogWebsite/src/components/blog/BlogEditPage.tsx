'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import {
  ArrowLeft,
  Tag,
  Plus,
  X,
  AlertCircle,
  Eye,
  Edit,
} from 'lucide-react'
import { blogsService } from '../../services/blogs'
import type { Blog } from '../../services/types'
import { authClient } from '../../lib/authClient'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import MarkdownEditor from './MarkdownEditor'

const OWNER_EMAIL = 'mishrashardendu22@gmail.com'

interface BlogEditPageProps {
  blogId: string
}

const BlogEditPage: React.FC<BlogEditPageProps> = ({ blogId }) => {
  const session = authClient.useSession()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchBlogPost = useCallback(async () => {
    try {
      setLoading(true)
      const response = await blogsService.getBlogById(blogId)
      if (response.success && response.data) {
        const blogData = response.data
        setBlog(blogData)
        setTitle(blogData.title)
        setContent(blogData.content)
        setTags(blogData.tags || [])
      }
    } catch {
      // Error handling for blog fetch
      setError('Failed to load blog post')
    } finally {
      setLoading(false)
    }
  }, [blogId])

  useEffect(() => {
    if (blogId) {
      fetchBlogPost()
    }
  }, [blogId, fetchBlogPost])

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  useEffect(() => {
    if (session?.data?.user?.email && session.data.user.email !== OWNER_EMAIL) {
      window.location.href = '/blog'
    }
  }, [session])

  // Don't render if not the owner
  if (!session?.data?.user || session.data.user.email !== OWNER_EMAIL) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to edit blog posts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/blog'}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
          <p className="text-foreground">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Blog not found</h2>
          <p className="text-muted-foreground mb-4">
            The blog post you're trying to edit doesn't exist.
          </p>
          <Button onClick={() => window.location.href = '/blog'}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button
              variant={!isPreview ? 'default' : 'outline'}
              onClick={() => setIsPreview(false)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant={isPreview ? 'default' : 'outline'}
              onClick={() => setIsPreview(true)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/blog'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>

      {error && (
        <div className="container mx-auto px-4 py-3">
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {isPreview ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{title || 'Untitled Post'}</CardTitle>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || 'No content yet...'}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
                <CardDescription>Edit the title and content of your blog post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-foreground">
                    Title
                  </label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl h-24 px-4 font-semibold"
                  />
                  <p className="text-sm text-muted-foreground">
                    Give your blog post an engaging title
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium text-foreground">
                    Content
                  </label>
                  <MarkdownEditor
                    content={content}
                    onChange={(newContent) => setContent(newContent)}
                    placeholder="Write your blog post content here..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </CardTitle>
                <CardDescription>Add tags to categorize your post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} variant="outline" size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

export default BlogEditPage
