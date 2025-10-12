import type { APIRoute } from 'astro'
import { db } from '../../../../../db'
import { commentsTable, blogTable } from '../../../../../db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '../../../../../lib/authHelper'

export const prerender = false

export const DELETE: APIRoute = async (context) => {
  try {
    // Require authentication - any logged-in user
    let user
    try {
      user = await requireAuth(context)
    } catch (authError) {
      if (authError instanceof Response) {
        return authError
      }
      throw authError
    }
    
    const blogId = parseInt(context.params.id!)
    const commentId = parseInt(context.params.commentId!)

    if (isNaN(blogId) || isNaN(commentId)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid blog ID or comment ID' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
    
    // Verify blog exists
    const blog = await db.select().from(blogTable).where(eq(blogTable.id, blogId)).limit(1)

    if (blog.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Blog not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Get the comment to check ownership
    const [comment] = await db
      .select({
        id: commentsTable.id,
        userId: commentsTable.userId,
      })
      .from(commentsTable)
      .where(and(eq(commentsTable.id, commentId), eq(commentsTable.blogId, blogId)))
      .limit(1)

    if (!comment) {
      return new Response(
        JSON.stringify({ success: false, error: 'Comment not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Check if user is either the blog owner OR the comment author
    const isCommentAuthor = comment.userId === user.id
    const isOwner = user.isOwner
    
    if (!isCommentAuthor && !isOwner) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Forbidden - You can only delete your own comments or if you are the blog owner' 
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Delete the comment
    await db.delete(commentsTable).where(eq(commentsTable.id, commentId))

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Comment deleted successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting comment:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to delete comment' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
