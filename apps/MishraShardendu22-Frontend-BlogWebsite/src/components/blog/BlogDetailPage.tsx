'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Separator } from '../ui/separator'
import { Calendar, User, Share2, Check, Edit, Clock, MessageCircle, ChevronUp, ChevronDown, ArrowLeft } from 'lucide-react'
import { blogsService } from '../../services/blogs'
import type { Blog, Comment } from '../../services/types'
import { authClient } from '../../lib/authClient'
import BlogComments from './BlogComments'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../../lib/utils'

interface BlogDetailPageProps {
  blogId: string
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ blogId }) => {
  const session = authClient.useSession()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [error, setError] = useState('')
  const [tagsExpanded, setTagsExpanded] = useState(false)

  const OWNER_EMAIL = 'mishrashardendu22@gmail.com'
  const isOwner = session?.data?.user?.email === OWNER_EMAIL

  useEffect(() => {
    fetchBlog()
    fetchComments()
  }, [blogId])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await blogsService.getBlogById(blogId)
      if (response.success && response.data) {
        setBlog(response.data)
      } else {
        setError('Failed to load blog')
      }
    } catch {
      setError('Failed to load blog')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await blogsService.getBlogComments(blogId)
      if (response.success && response.data) {
        setComments(Array.isArray(response.data) ? response.data : [])
      }
    } catch {
      // Silent fail for comments
    }
  }

  const handleAddComment = async (content: string) => {
    if (!session?.data?.user?.id) return

    try {
      const response = await blogsService.addBlogComment(blogId, {
        content,
        userId: session.data.user.id,
      })
      if (response.success) {
        await fetchComments()
      }
    } catch {
      // Silent fail
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await blogsService.deleteBlogComment(blogId, commentId)
      if (response.success) {
        await fetchComments()
      }
    } catch {
      // Silent fail
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareSuccess(true)
      setTimeout(() => setShareSuccess(false), 2000)
    } catch {
      // Silent fail
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
  }

  // Markdown components for proper rendering
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const markdownComponents = useMemo(
    () => ({
      h1: ({ children, className: _className, ...props }: any) => (
        <h1
          className={cn(
            'text-3xl md:text-4xl font-extrabold mb-6 mt-8 text-foreground font-heading',
            _className
          )}
          {...props}
        >
          {children}
        </h1>
      ),
      h2: ({ children, className: _className, ...props }: any) => (
        <h2
          className={cn(
            'text-2xl md:text-3xl font-bold mb-5 mt-8 text-foreground font-heading border-b border-border/40 pb-3',
            _className
          )}
          {...props}
        >
          {children}
        </h2>
      ),
      h3: ({ children, className: _className, ...props }: any) => (
        <h3
          className={cn(
            'text-xl md:text-2xl font-semibold mb-4 mt-6 text-foreground font-heading',
            _className
          )}
          {...props}
        >
          {children}
        </h3>
      ),
      h4: ({ children, className: _className, ...props }: any) => (
        <h4
          className={cn('text-lg md:text-xl font-semibold mb-3 mt-5 text-foreground', _className)}
          {...props}
        >
          {children}
        </h4>
      ),
      p: ({ children, className: _className, ...props }: any) => (
        <p className={cn('mb-6 text-base md:text-lg text-foreground/90 leading-relaxed', _className)} {...props}>
          {children}
        </p>
      ),
      ul: ({ children, className: _className, ...props }: any) => (
        <ul className={cn('list-disc pl-8 mb-6 space-y-2', _className)} {...props}>
          {children}
        </ul>
      ),
      ol: ({ children, className: _className, ...props }: any) => (
        <ol className={cn('list-decimal pl-8 mb-6 space-y-2', _className)} {...props}>
          {children}
        </ol>
      ),
      li: ({ children, className: _className, ...props }: any) => (
        <li className={cn('text-base md:text-lg text-foreground/90 leading-relaxed', _className)} {...props}>
          {children}
        </li>
      ),
      code: ({ children, className: _className, inline, ...props }: any) => {
        if (inline) {
          return (
            <code
              className={cn(
                'bg-muted/80 px-2 py-1 rounded-md text-sm font-mono text-accent border border-border/40',
                _className
              )}
              {...props}
            >
              {children}
            </code>
          )
        }
        return (
          <code className={cn('font-mono text-sm', _className)} {...props}>
            {children}
          </code>
        )
      },
      pre: ({ children, className: _className, ...props }: any) => (
        <pre
          className={cn(
            'bg-muted/60 p-4 md:p-6 rounded-xl overflow-x-auto mb-6 border border-border/40 shadow-sm',
            _className
          )}
          {...props}
        >
          {children}
        </pre>
      ),
      blockquote: ({ children, className: _className, ...props }: any) => (
        <blockquote
          className={cn(
            'border-l-4 border-primary pl-4 md:pl-6 py-2 italic mb-6 bg-primary/5 rounded-r-lg',
            _className
          )}
          {...props}
        >
          {children}
        </blockquote>
      ),
      a: ({ children, className: _className, href, ...props }: any) => (
        <a
          href={href}
          className={cn(
            'text-primary underline underline-offset-4 hover:text-primary/80 transition-colors',
            _className
          )}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      ),
      strong: ({ children, className: _className, ...props }: any) => (
        <strong className={cn('font-bold text-foreground', _className)} {...props}>
          {children}
        </strong>
      ),
      em: ({ children, className: _className, ...props }: any) => (
        <em className={cn('italic', _className)} {...props}>
          {children}
        </em>
      ),
      hr: ({ className: _className, ...props }: any) => (
        <hr className={cn('my-8 border-t border-border/40', _className)} {...props} />
      ),
      img: ({ src, alt, className: _className, ...props }: any) => (
        <img
          src={src}
          alt={alt || 'Blog image'}
          className={cn(
            'w-full rounded-lg mb-6 shadow-lg border border-border/40',
            _className
          )}
          {...props}
        />
      ),
      table: ({ children, className: _className, ...props }: any) => (
        <div className="overflow-x-auto mb-6">
          <table
            className={cn(
              'w-full border-collapse border border-border/40 rounded-lg',
              _className
            )}
            {...props}
          >
            {children}
          </table>
        </div>
      ),
      thead: ({ children, className: _className, ...props }: any) => (
        <thead className={cn('bg-muted', _className)} {...props}>
          {children}
        </thead>
      ),
      tbody: ({ children, className: _className, ...props }: any) => (
        <tbody className={cn('', _className)} {...props}>
          {children}
        </tbody>
      ),
      tr: ({ children, className: _className, ...props }: any) => (
        <tr className={cn('border-b border-border/40', _className)} {...props}>
          {children}
        </tr>
      ),
      th: ({ children, className: _className, ...props }: any) => (
        <th
          className={cn('px-4 py-2 text-left font-semibold text-foreground', _className)}
          {...props}
        >
          {children}
        </th>
      ),
      td: ({ children, className: _className, ...props }: any) => (
        <td className={cn('px-4 py-2 text-foreground/90', _className)} {...props}>
          {children}
        </td>
      ),
    }),
    []
  )
  /* eslint-enable @typescript-eslint/no-explicit-any */

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-destructive text-lg">{error || 'Blog not found'}</p>
        <Button onClick={() => window.location.href = '/blog'} className="mt-4">
          Back to Blog
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 ">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-8 xl:gap-12">
        <main className="min-w-0">
          <article className="space-y-6">
            <header className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                {blog.title}
              </h1>
            </header>

            <Separator />

            <div className="prose max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {blog.content}
              </ReactMarkdown>
            </div>
          </article>
        </main>


        <aside className="lg:sticky lg:top-12 lg:h-fit space-y-2">
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-md p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-20 h-20 border-2 border-primary/20 ring-2 ring-primary/10">
                <AvatarImage src={blog.author.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {blog.author.name ? getInitials(blog.author.name) : <User className="w-8 h-8" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  {blog.author.name || blog.author.email}
                </h3>
                <p className="text-sm text-muted-foreground">Author</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Published {formatDate(blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{Math.ceil(blog.content.split(' ').length / 200)} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
              </div>
            </div>

            {isOwner && (
              <Button
                variant="default"
                className="w-full my-2"
                onClick={() => window.location.href = `/blog/${blogId}/edit`}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Post
              </Button>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleShare}
              >
                {shareSuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Article
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.location.href = '/blog'}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </div>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-md shadow-lg overflow-hidden">
              <button
                onClick={() => setTagsExpanded(!tagsExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-accent/5 transition-colors"
              >
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Tags
                  <Badge variant="secondary" className="text-xs">
                    {blog.tags.length}
                  </Badge>
                </h3>
                {tagsExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {tagsExpanded && (
                <div className="p-4 pt-0">
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:bg-primary/20 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comments Section */}
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-md shadow-lg p-6">
            <BlogComments
              comments={comments}
              currentUserId={session?.data?.user?.id}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              loading={loading}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}

export default BlogDetailPage
