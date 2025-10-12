import type { APIRoute } from 'astro'
import { db } from '../../../db'
import { blogTable, userProfilesTable, commentsTable } from '../../../db/schema'
import { eq, desc, like, and, or, count, sql } from 'drizzle-orm'
import { user as usersTable } from '../../../db/authSchema'
import { requireOwner } from '../../../lib/authHelper'

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tag = searchParams.get('tag')
    const author = searchParams.get('author')
    const search = searchParams.get('search')
    const offset = (page - 1) * limit

    const conditions = []

    if (tag) {
      conditions.push(sql`${blogTable.tags} @> ARRAY[${tag}]::text[]`)
    }

    if (search) {
      conditions.push(
        or(
          like(blogTable.title, `%${search}%`),
          like(blogTable.content, `%${search}%`)
        )
      )
    }

    if (author) {
      conditions.push(eq(blogTable.authorId, author))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const blogs = await db
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
      .where(whereClause)
      .orderBy(desc(blogTable.createdAt))
      .limit(limit)
      .offset(offset)

    const blogsWithCounts = await Promise.all(
      blogs.map(async (blog) => {
        const [commentsCount] = await Promise.all([
          db
            .select({ count: count() })
            .from(commentsTable)
            .where(eq(commentsTable.blogId, blog.id)),
        ])

        return {
          ...blog,
          comments: commentsCount[0]?.count || 0,
        }
      })
    )

    const totalCount = await db.select({ count: count() }).from(blogTable).where(whereClause)

    return new Response(
      JSON.stringify({
        success: true,
        data: blogsWithCounts,
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
    console.error('Error fetching blogs:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch blogs' }),
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
    // Require owner authentication
    let user
    try {
      user = await requireOwner(context)
    } catch (authError) {
      if (authError instanceof Response) {
        return authError
      }
      throw authError
    }
    
    const body = await context.request.json()
    const { title, content, tags } = body

    if (!title || !content) {
      return new Response(
        JSON.stringify({ success: false, error: 'Title and content are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Use authenticated user's ID as authorId
    const [newBlog] = await db
      .insert(blogTable)
      .values({
        title,
        content,
        tags: tags || [],
        authorId: user.id,
      })
      .returning({
        id: blogTable.id,
        title: blogTable.title,
        content: blogTable.content,
        tags: blogTable.tags,
        authorId: blogTable.authorId,
        createdAt: blogTable.createdAt,
        updatedAt: blogTable.updatedAt,
      })

    return new Response(JSON.stringify({ success: true, data: newBlog }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating blog:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to create blog' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
