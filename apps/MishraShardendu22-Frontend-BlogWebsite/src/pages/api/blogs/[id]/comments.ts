import type { APIRoute } from 'astro'
import { db } from '../../../../db'
import { commentsTable, blogTable, userProfilesTable } from '../../../../db/schema'
import { eq, desc, count } from 'drizzle-orm'
import { user as usersTable } from '../../../../db/authSchema'
import { requireAuth } from '../../../../lib/authHelper'

export const prerender = false

export const GET: APIRoute = async ({ params, url }) => {
  try {
    const blogId = parseInt(params.id!)
    const searchParams = url.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

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

    const comments = await db
      .select({
        id: commentsTable.id,
        content: commentsTable.content,
        userId: commentsTable.userId,
        blogId: commentsTable.blogId,
        createdAt: commentsTable.createdAt,
        user: {
          id: usersTable.id,
          email: usersTable.email,
          avatar: usersTable.image,
          name: usersTable.name,
        },
        userProfile: {
          firstName: userProfilesTable.firstName,
          lastName: userProfilesTable.lastName,
          avatar: userProfilesTable.avatar,
        },
      })
      .from(commentsTable)
      .leftJoin(usersTable, eq(commentsTable.userId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .where(eq(commentsTable.blogId, blogId))
      .orderBy(desc(commentsTable.createdAt))
      .limit(limit)
      .offset(offset)

    const totalCount = await db
      .select({ count: count() })
      .from(commentsTable)
      .where(eq(commentsTable.blogId, blogId))

    return new Response(
      JSON.stringify({
        success: true,
        data: comments,
        pagination: {
          page,
          limit,
          total: totalCount[0]?.count || 0,
          totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
        },
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
    console.error('Error fetching comments:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch comments' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

export const POST: APIRoute = async (context) => {
  try {
    // Anyone can comment, but they must be logged in
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
    const body = await context.request.json()
    const { content } = body

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

    if (!content) {
      return new Response(
        JSON.stringify({ success: false, error: 'Content is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

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

    // Any logged-in user can comment
    const [newComment] = await db
      .insert(commentsTable)
      .values({
        content,
        userId: user.id,
        blogId,
      })
      .returning({
        id: commentsTable.id,
        content: commentsTable.content,
        userId: commentsTable.userId,
        blogId: commentsTable.blogId,
        createdAt: commentsTable.createdAt,
      })

    return new Response(JSON.stringify({ success: true, data: newComment }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating comment:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to create comment' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}