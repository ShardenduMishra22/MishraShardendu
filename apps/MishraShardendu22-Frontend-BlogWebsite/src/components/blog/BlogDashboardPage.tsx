'use client'

import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  BookOpen,
  Plus,
  Search,
  MessageCircle,
  ArrowRight,
  Trash2,
  BarChart3,
  AlertTriangle,
  Activity,
  Award,
} from 'lucide-react'
import { blogsService } from '../../services/blogs'
import type { Blog } from '../../services/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import toast, { Toaster } from 'react-hot-toast'
import { StatCard } from './StatCard'
import BlogCard from './BlogCard'
import { authClient } from '../../lib/authClient'

const OWNER_EMAIL = 'mishrashardendu22@gmail.com'

interface ApiStatsData {
  totalPosts: number
  totalComments: number
  averageCommentsPerPost: number
  recentPosts: Blog[]
  tagStats: Array<{ tag: string; count: number }>
  authorStats: Array<{
    authorId: string
    authorEmail: string | null
    firstName: string | null
    lastName: string | null
    postCount: number
  }>
  topPerformingPost?: Blog | null
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatNumber = (num: number | undefined | null) => {
  if (num == null || isNaN(num)) {
    return '0'
  }

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export default function BlogDashboardPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [error, setError] = useState('')
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null)
  const [apiStats, setApiStats] = useState<ApiStatsData | null>(null)
  const session = authClient.useSession()

  // Access control - only allow owner to access this page
  useEffect(() => {
    if (session?.data?.user?.email && session.data.user.email !== OWNER_EMAIL) {
      window.location.href = '/blog'
    }
  }, [session?.data?.user?.email])

  // Fetch blogs and stats on mount
  useEffect(() => {
    if (!session.isPending) {
      fetchBlogsAndStats()
    }
  }, [session.isPending])

  const currentUser = session.data?.user

  const isAuthor = (blogAuthorId: string) => {
    return currentUser?.id === blogAuthorId
  }

  const fetchBlogsAndStats = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch stats
      const statsResponse = await blogsService.getBlogStats()
      if (statsResponse.success && statsResponse.data) {
        setApiStats(statsResponse.data)
      }

      // Fetch blogs
      const response = await blogsService.getBlogs()
      if (response.success && response.data) {
        const blogsArray = Array.isArray(response.data) ? response.data : []
        setBlogs(blogsArray)
      } else {
        const errorMsg = response.error || 'Failed to fetch blogs'
        setError(errorMsg)
        // eslint-disable-next-line no-console
        console.error('Blog fetch failed:', errorMsg)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error)
      setError('Failed to load data. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const sortBlogs = (blogsToSort: Blog[]) => {
    switch (sortBy) {
      case 'newest':
        return [...blogsToSort].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      case 'oldest':
        return [...blogsToSort].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      case 'title':
        return [...blogsToSort].sort((a, b) => a.title.localeCompare(b.title))
      case 'comments':
        return [...blogsToSort].sort((a, b) => {
          const aComments = Array.isArray(a.comments) ? a.comments.length : a.comments || 0
          const bComments = Array.isArray(b.comments) ? b.comments.length : b.comments || 0
          return bComments - aComments
        })
      default:
        return blogsToSort
    }
  }

  const filteredAndSortedBlogs = sortBlogs(
    blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTab = activeTab === 'all' || blog.tags?.includes(activeTab)
      return matchesSearch && matchesTab
    })
  )

  const getTotalStats = () => {
    const totalComments = blogs.reduce((sum, blog) => {
      const comments = Array.isArray(blog.comments) ? blog.comments.length : blog.comments || 0
      return sum + comments
    }, 0)

    const averageComments = blogs.length > 0 ? totalComments / blogs.length : 0

    return { totalComments, averageComments }
  }

  const stats = getTotalStats()

  const handleDeleteBlog = async (blogId: string) => {
    try {
      setDeletingBlogId(blogId)
      const response = await blogsService.deleteBlog(blogId)

      if (response.success) {
        toast.success('Blog post deleted successfully')
        setBlogs(blogs.filter((blog) => String(blog.id) !== String(blogId)))
      } else {
        toast.error(response.error || 'Failed to delete blog post')
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting blog:', error)
      toast.error('Failed to delete blog post')
    } finally {
      setDeletingBlogId(null)
    }
  }

  // Don't render dashboard if not the owner
  if (!session.isPending && (!session?.data?.user || session.data.user.email !== OWNER_EMAIL)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-destructive/20">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Access Denied</h2>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            You don&apos;t have permission to access the blog dashboard. This area is restricted to
            authorized users only.
          </p>
          <Button
            onClick={() => (window.location.href = '/blog')}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Blogs
          </Button>
        </div>
      </div>
    )
  }

  if (loading || session.isPending) {
    return (
      <div className="min-h-screen bg-background">
        <Toaster position="top-right" />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 bg-muted/50 rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-muted/50 rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-muted/50 rounded-lg animate-pulse" />
          </div>

          <div className="flex space-x-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-20 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>

          <div className="max-w-2xl">
            <div className="h-10 w-full bg-muted/50 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg">
                <div className="aspect-[16/10] bg-muted/50 relative overflow-hidden rounded-t-lg" />

                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-muted/50 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-muted/50 rounded animate-pulse mb-1" />
                      <div className="h-3 w-16 bg-muted/50 rounded animate-pulse" />
                    </div>
                  </div>

                  <div className="h-6 w-3/4 bg-muted/50 rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-muted/50 rounded animate-pulse mb-1" />
                  <div className="h-4 w-5/6 bg-muted/50 rounded animate-pulse mb-3" />

                  <div className="flex flex-wrap gap-1 mb-4">
                    <div className="h-5 w-12 bg-muted/50 rounded-full animate-pulse" />
                    <div className="h-5 w-16 bg-muted/50 rounded-full animate-pulse" />
                    <div className="h-5 w-14 bg-muted/50 rounded-full animate-pulse" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-muted/50 rounded animate-pulse" />
                        <div className="h-3 w-8 bg-muted/50 rounded animate-pulse" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-muted/50 rounded animate-pulse" />
                        <div className="h-3 w-8 bg-muted/50 rounded animate-pulse" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-muted/50 rounded animate-pulse" />
                        <div className="h-3 w-8 bg-muted/50 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-muted/50 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!session?.data?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Toaster position="top-right" />
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-2">
            Authentication Required
          </h2>
          <p className="text-foreground mb-6 text-sm">
            Please log in to access your blog dashboard.
          </p>
          <Button onClick={() => (window.location.href = '/api/auth/signin')} className="h-10 px-6">
            Login with Google
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage your blog posts and view analytics</p>
      </div>
      
      {/* Analytics Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Posts"
          value={formatNumber(apiStats?.totalPosts || blogs.length)}
          description="Published articles"
          icon={BookOpen}
          variant="primary"
        />

        <StatCard
          title="Total Comments"
          value={formatNumber(apiStats?.totalComments || stats.totalComments)}
          description="User engagement"
          icon={MessageCircle}
          variant="accent"
        />

        <StatCard
          title="Avg Engagement"
          value={(apiStats?.averageCommentsPerPost || stats.averageComments).toFixed(1)}
          description="Comments per post"
          icon={Activity}
          variant="blue"
        />

        <StatCard
          title="Top Post"
          value={
            apiStats?.topPerformingPost?.comments
              ? Array.isArray(apiStats.topPerformingPost.comments)
                ? apiStats.topPerformingPost.comments.length
                : apiStats.topPerformingPost.comments
              : 0
          }
          description="Most comments"
          icon={Award}
          variant="green"
        />
      </div>

      {/* Search and Filters Section with Tabs */}
      <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 items-center">
            {/* Tabs on the left */}
            <div className="flex gap-2 w-full lg:w-auto">
              <Button
                variant={activeTab === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveTab('all')}
                className="flex-1 lg:flex-initial h-10 px-6"
              >
                Posts
              </Button>
              <Button
                variant={activeTab === 'stats' ? 'default' : 'outline'}
                onClick={() => setActiveTab('stats')}
                className="flex-1 lg:flex-initial h-10 px-6"
              >
                Stats
              </Button>
            </div>

            {/* Search bar */}
            <div className="relative w-full sm:w-80 lg:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search your blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-10 bg-background/60 border-border/70 focus:border-primary/50 rounded-lg text-sm transition-colors"
              />
            </div>

            {/* Sort and Create Post buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 px-3 bg-background/60 border border-border/70 rounded-lg text-sm font-medium text-foreground focus:border-primary/50 focus:outline-none transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Alphabetical</option>
                <option value="comments">Most Comments</option>
              </select>

              <Button 
                onClick={() => (window.location.href = '/blog/create')} 
                className="gap-2 h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Create Post
              </Button>
            </div>
          </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Posts Tab Content */}
      {activeTab === 'all' && (
        <div className="mt-4">
          {filteredAndSortedBlogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                {searchTerm ? 'No blogs found' : 'No blogs yet'}
              </h3>
              <p className="text-foreground text-sm max-w-md mx-auto mb-6">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Start your blogging journey by creating your first post'}
              </p>
              {!searchTerm && (
                <Button onClick={() => (window.location.href = '/blog/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAndSortedBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onReadMore={(blogId) => (window.location.href = `/blog/${blogId}`)}
                  customActions={
                    isAuthor(blog.authorId) ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={deletingBlogId === String(blog.id)}
                          >
                            {deletingBlogId === String(blog.id) ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-destructive" />
                              Delete Blog Post
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{blog.title}&quot;? This action
                              cannot be undone and will permanently remove the blog post and all its
                              associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBlog(blog.id.toString())}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Post
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

        {/* Stats Tab Content */}
        {activeTab === 'stats' && (
          <div className="mt-4 space-y-6">
          {/* Top Performing Post */}
          {apiStats?.topPerformingPost && (
            <Card className="bg-card/40 backdrop-blur-sm border-border/70 hover:border-primary/30 transition-all shadow-sm">
              <CardHeader className="pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold font-heading">
                      Top Performing Post
                    </CardTitle>
                    <CardDescription className="text-sm">Most engaging content</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar className="w-12 h-12 flex-shrink-0 border border-border/50">
                      <AvatarImage src={apiStats.topPerformingPost.author?.avatar || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {apiStats.topPerformingPost.author?.name
                          ? apiStats.topPerformingPost.author.name.charAt(0).toUpperCase()
                          : apiStats.topPerformingPost.author?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground mb-1.5 line-clamp-1 text-lg">
                        {apiStats.topPerformingPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by{' '}
                        {apiStats.topPerformingPost.author?.name ||
                          apiStats.topPerformingPost.author?.email ||
                          'Unknown Author'}{' '}
                        • {formatDate(apiStats.topPerformingPost.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent mb-1">
                        {formatNumber(
                          Array.isArray(apiStats.topPerformingPost.comments)
                            ? apiStats.topPerformingPost.comments.length
                            : apiStats.topPerformingPost.comments || 0
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">Comments</div>
                    </div>
                    <Button
                      onClick={() =>
                        (window.location.href = `/blog/${apiStats.topPerformingPost?.id}`)
                      }
                      variant="outline"
                      size="sm"
                      className="h-10 px-4 border-border/70 hover:bg-primary/5 hover:border-primary/50 transition-all gap-2"
                    >
                      View Post
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tag Statistics */}
          {apiStats?.tagStats && apiStats.tagStats.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">Tag Statistics</CardTitle>
                <CardDescription className="text-sm">Posts by category</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {apiStats.tagStats
                    .sort((a, b) => b.count - a.count)
                    .map((tagStat) => (
                      <div
                        key={tagStat.tag}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <Badge variant="secondary" className="text-xs">
                          {tagStat.tag}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-bold">{tagStat.count}</div>
                          <div className="text-xs text-muted-foreground">posts</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        )}
    </div>
  )
}

