import type { APIRoute } from 'astro'
import { db } from '../../../db'
import { blogTable, userProfilesTable, commentsTable } from '../../../db/schema'
import { eq, count, desc, sql } from 'drizzle-orm'
import { user as usersTable } from '../../../db/authSchema'

export const prerender = false

export const GET: APIRoute = async () => {
  try {
    const [totalPosts, totalComments] = await Promise.all([
      db.select({ count: count() }).from(blogTable),
      db.select({ count: count() }).from(commentsTable),
    ])

    const recentPostsRaw = await db
      .select({
        id: blogTable.id,
        title: blogTable.title,
        content: blogTable.content,
        tags: blogTable.tags,
        authorId: blogTable.authorId,
        createdAt: blogTable.createdAt,
        updatedAt: blogTable.updatedAt,
        authorEmail: usersTable.email,
        authorName: usersTable.name,
        authorImage: usersTable.image,
        firstName: userProfilesTable.firstName,
        lastName: userProfilesTable.lastName,
        avatar: userProfilesTable.avatar,
      })
      .from(blogTable)
      .leftJoin(usersTable, eq(blogTable.authorId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .orderBy(desc(blogTable.createdAt))
      .limit(5)

    // Format recent posts to match Blog interface with comment counts
    const recentPosts = await Promise.all(
      recentPostsRaw.map(async (post) => {
        const commentsCount = await db
          .select({ count: count() })
          .from(commentsTable)
          .where(eq(commentsTable.blogId, post.id))

        return {
          id: post.id,
          title: post.title,
          content: post.content,
          tags: post.tags || [],
          authorId: post.authorId,
          createdAt: post.createdAt?.toISOString() || '',
          updatedAt: post.updatedAt?.toISOString() || '',
          comments: commentsCount[0]?.count || 0,
          author: {
            id: post.authorId,
            email: post.authorEmail || '',
            name:
              post.firstName && post.lastName
                ? `${post.firstName} ${post.lastName}`
                : post.authorName || post.authorEmail || 'Unknown',
            avatar: post.avatar || post.authorImage || '',
          },
        }
      })
    )

    const authorStats = await db
      .select({
        authorId: blogTable.authorId,
        authorEmail: usersTable.email,
        authorName: usersTable.name,
        firstName: userProfilesTable.firstName,
        lastName: userProfilesTable.lastName,
        avatar: userProfilesTable.avatar,
        postCount: count(blogTable.id),
      })
      .from(blogTable)
      .leftJoin(usersTable, eq(blogTable.authorId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .groupBy(
        blogTable.authorId,
        usersTable.email,
        usersTable.name,
        userProfilesTable.firstName,
        userProfilesTable.lastName,
        userProfilesTable.avatar
      )
      .orderBy(desc(count(blogTable.id)))

    const tagStats = await db
      .select({
        tag: sql<string>`unnest(${blogTable.tags})`,
        count: count(blogTable.id),
      })
      .from(blogTable)
      .groupBy(sql`unnest(${blogTable.tags})`)
      .orderBy(desc(count(blogTable.id)))

    const stats = {
      totalPosts: totalPosts[0]?.count || 0,
      totalComments: totalComments[0]?.count || 0,
      averageCommentsPerPost: totalPosts[0]?.count
        ? Math.round(((totalComments[0]?.count || 0) / (totalPosts[0]?.count as number)) * 100) / 100
        : 0,
      recentPosts: recentPosts,
      authorStats: authorStats,
      tagStats: tagStats,
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: stats,
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
    console.error('Error fetching blog stats:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch stats' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
