'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Save, X, Plus } from 'lucide-react'
import { blogsService } from '../../services/blogs'
import { authClient } from '../../lib/authClient'
import MarkdownEditor from './MarkdownEditor'

const OWNER_EMAIL = 'mishrashardendu22@gmail.com'

const BlogCreatePage = () => {
  const session = authClient.useSession()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (session?.data?.user?.email && session.data.user.email !== OWNER_EMAIL) {
      window.location.href = '/blog'
    }
  }, [session])

  const handleAddTag = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content')
      return
    }

    const userId = session?.data?.user?.id

    if (!userId) {
      setError('Not authenticated. Please log in again.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      setSuccess('')

      const response = await blogsService.createBlog({
        title: title.trim(),
        content: content.trim(),
        tags: tags,
        authorId: userId,
      })

      if (response.success) {
        setSuccess('Blog post created successfully!')
        setTimeout(() => {
          window.location.href = '/blog'
        }, 1500)
      } else {
        setError(response.error || 'Failed to create blog post')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session?.data?.user || session.data.user.email !== OWNER_EMAIL) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You don't have permission to create blog posts.</p>
        <Button onClick={() => window.location.href = '/blog'}>
          Back to Blog
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title and Tags Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Title Section - Left Half */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-base font-semibold">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter your blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl h-12 px-4 font-semibold border-2 focus:border-primary transition-colors"
              required
            />
            <p className="text-sm text-muted-foreground">
              Give your blog post an engaging title
            </p>
          </div>

          {/* Tags Section - Right Half */}
          <div className="space-y-3">
            <Label htmlFor="tags" className="text-base font-semibold">
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                className="h-12 border-2 focus:border-primary transition-colors"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                className="h-12 px-4 border-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Add tags to categorize your post (press Enter to add)
            </p>
            
            {/* Tags Display */}
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3 p-3 bg-muted/30 rounded-lg border min-h-[60px]">
                {tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="gap-1 px-3 py-1.5 text-sm hover:bg-secondary/80 transition-colors"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive transition-colors"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-6 bg-muted/20 rounded-lg border border-dashed min-h-[60px]">
                <p className="text-sm text-muted-foreground italic">
                  No tags added yet. Add tags to help readers find your content.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Content Section - Full Width */}
        <div className="space-y-3">
          <Label htmlFor="content" className="text-base font-semibold">
            Content
          </Label>
          <MarkdownEditor
            content={content}
            onChange={(newContent) => setContent(newContent)}
            placeholder="Write your blog content using the rich text editor..."
          />
          <p className="text-sm text-muted-foreground">
            Use the toolbar to format your content. The editor supports rich text formatting including headings, lists, links, and more.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4 border-t">
          <Button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="flex-1 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BlogCreatePage
