import type { APIRoute } from 'astro'
import { db } from '../../../db'
import { blogTable, userProfilesTable, commentsTable } from '../../../db/schema'
import { eq, count } from 'drizzle-orm'
import { user as usersTable } from '../../../db/authSchema'
import { requireOwner } from '../../../lib/authHelper'

export const prerender = false

export const GET: APIRoute = async ({ params }) => {
  try {
    const blogId = parseInt(params.id!)

    if (isNaN(blogId)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid blog ID' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const blog = await db
      .select({
        id: blogTable.id,
        title: blogTable.title,
        content: blogTable.content,
        tags: blogTable.tags,
        authorId: blogTable.authorId,
        createdAt: blogTable.createdAt,
        updatedAt: blogTable.updatedAt,
        author: {
          id: usersTable.id,
          email: usersTable.email,
          avatar: usersTable.image,
          name: usersTable.name,
        },
        authorProfile: {
          firstName: userProfilesTable.firstName,
          lastName: userProfilesTable.lastName,
          avatar: userProfilesTable.avatar,
        },
      })
      .from(blogTable)
      .leftJoin(usersTable, eq(blogTable.authorId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .where(eq(blogTable.id, blogId))
      .limit(1)

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

    const [commentsCount] = await Promise.all([
      db.select({ count: count() }).from(commentsTable).where(eq(commentsTable.blogId, blogId)),
    ])

    const blogWithCounts = {
      ...blog[0],
      comments: commentsCount[0]?.count || 0,
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: blogWithCounts,
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
    console.error('Error fetching blog:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch blog' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

export const PATCH: APIRoute = async (context) => {
  try {
    // Require owner authentication
    try {
      await requireOwner(context)
    } catch (authError) {
      if (authError instanceof Response) {
        return authError
      }
      throw authError
    }
    
    const blogId = parseInt(context.params.id!)
    const body = await context.request.json()
    const { title, content, tags } = body

    if (isNaN(blogId)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid blog ID' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const existingBlog = await db.select().from(blogTable).where(eq(blogTable.id, blogId)).limit(1)

    if (existingBlog.length === 0) {
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

    const [updatedBlog] = await db
      .update(blogTable)
      .set({
        title: title || existingBlog[0].title,
        content: content || existingBlog[0].content,
        tags: tags || existingBlog[0].tags,
        updatedAt: new Date(),
      })
      .where(eq(blogTable.id, blogId))
      .returning({
        id: blogTable.id,
        title: blogTable.title,
        content: blogTable.content,
        tags: blogTable.tags,
        authorId: blogTable.authorId,
        createdAt: blogTable.createdAt,
        updatedAt: blogTable.updatedAt,
      })

    return new Response(
      JSON.stringify({
        success: true,
        data: updatedBlog,
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
    console.error('Error updating blog:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to update blog' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

export const DELETE: APIRoute = async (context) => {
  try {
    // Require owner authentication
    try {
      await requireOwner(context)
    } catch (authError) {
      if (authError instanceof Response) {
        return authError
      }
      throw authError
    }
    
    const blogId = parseInt(context.params.id!)

    if (isNaN(blogId)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid blog ID' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const existingBlog = await db.select().from(blogTable).where(eq(blogTable.id, blogId)).limit(1)

    if (existingBlog.length === 0) {
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

    await db.delete(blogTable).where(eq(blogTable.id, blogId))

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Blog deleted successfully',
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
    console.error('Error deleting blog:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to delete blog' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

// Alias PUT to PATCH for compatibility with service layer
export const PUT = PATCH
