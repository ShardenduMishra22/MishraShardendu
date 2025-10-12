'use client'

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Separator } from '../ui/separator'
import { MessageCircle, Send, MoreHorizontal, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { authClient } from '../../lib/authClient'
import type { Comment } from '../../services/types'

interface BlogCommentsProps {
  comments: Comment[]
  currentUserId?: string
  onAddComment: (content: string) => Promise<void>
  onDeleteComment?: (commentId: number) => Promise<void>
  loading?: boolean
}

const OWNER_EMAIL = 'mishrashardendu22@gmail.com'

const BlogComments: React.FC<BlogCommentsProps> = ({
  comments,
  currentUserId,
  onAddComment,
  onDeleteComment,
  loading = false,
}) => {
  const session = authClient.useSession()
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isOwner = session?.data?.user?.email === OWNER_EMAIL

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U'
  }

  const handleSubmitComment = async () => {
    if (newComment.trim() && !submitting) {
      setSubmitting(true)
      try {
        await onAddComment(newComment.trim())
        setNewComment('')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to add comment:', error)
      } finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
          <MessageCircle className="w-3 h-3 text-primary" />
        </div>
        <h3 className="text-base font-semibold">Comments ({comments.length})</h3>
      </div>

      {currentUserId && (
        <div className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] bg-background border-border resize-none"
            placeholder="Write a comment..."
            disabled={submitting || loading}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || submitting || loading}
            className="w-full h-9"
          >
            <Send className="w-4 h-4 mr-2" />
            {submitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      )}

      {comments.length > 0 && <Separator className="my-4" />}

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8 flex-shrink-0 border border-border/30">
                  <AvatarImage 
                    src={comment.user?.avatar || comment.userProfile?.avatar } 
                    alt={comment.user?.name || comment.userProfile?.firstName || comment.user?.email || 'User'}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {comment.user?.name
                      ? comment.user.name.charAt(0).toUpperCase()
                      : comment.userProfile?.firstName && comment.userProfile?.lastName
                      ? getInitials(comment.userProfile.firstName, comment.userProfile.lastName)
                      : comment.user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-foreground text-sm">
                        {comment.user?.name ||
                          (comment.userProfile?.firstName && comment.userProfile?.lastName
                            ? `${comment.userProfile.firstName} ${comment.userProfile.lastName}`
                            : comment.user?.email || 'Anonymous')}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                    </div>

                    {/* Delete button for owner or comment author */}
                    {onDeleteComment && (isOwner || comment.userId === session?.data?.user?.id) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onDeleteComment(comment.id)}
                            className="text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BlogComments
