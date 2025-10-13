<script lang="ts">
  import Button from "./ui/button.svelte";
  import Badge from "./ui/badge.svelte";
  import Avatar from "./ui/avatar.svelte";
  import Input from "./ui/input.svelte";
  import Textarea from "./ui/textarea.svelte";
  import { Calendar, User, Share2, Check, ArrowLeft, MessageCircle, Send, Trash } from "lucide-svelte";
  import { cn } from "../utils";
  import { blogApi, commentApi, type Blog, type Comment } from "../api";
  import { authStore } from "../auth";
  import { toast } from "../toast";
  import { validateCommentContent } from "../validation";
  import { updateSEO, generateBlogPostStructuredData, insertStructuredData, truncateDescription } from "../seo";
  import { onMount } from "svelte";

  let { blogId }: { blogId: string } = $props();

  let blog = $state<Blog | null>(null);
  let comments = $state<Comment[]>([]);
  let loading = $state(true);
  let shareSuccess = $state(false);
  let error = $state("");
  let newComment = $state("");
  let isSubmittingComment = $state(false);
  let currentUser = $state<any>(null);
  let commentError = $state("");

  // Subscribe to auth store
  authStore.subscribe((state) => {
    currentUser = state.user;
  });

  onMount(async () => {
    await loadBlog();
    await loadComments();
  });

  const loadBlog = async () => {
    try {
      loading = true;
      error = "";
      const response = await blogApi.getBlogById(parseInt(blogId));
      if (response.success && response.data) {
        blog = response.data;
        
        // Update SEO with blog data
        const baseUrl = 'https://blog.mishrashardendu22.is-a.dev';
        const blogUrl = `${baseUrl}/blog/${blogId}`;
        const description = truncateDescription(blog.content, 160);
        const authorName = blog.author?.name || 'Shardendu Mishra';
        
        updateSEO({
          title: `${blog.title} | Shardendu Mishra Blog`,
          description: description,
          url: blogUrl,
          type: 'article',
          author: authorName,
          publishedTime: blog.createdAt,
          modifiedTime: blog.updatedAt,
          tags: Array.isArray(blog.tags) ? blog.tags : [],
        });

        // Add structured data for SEO
        const structuredData = generateBlogPostStructuredData({
          title: blog.title,
          description: description,
          author: authorName,
          datePublished: blog.createdAt,
          dateModified: blog.updatedAt,
          url: blogUrl,
        });
        insertStructuredData(structuredData);
      }
    } catch (err: any) {
      console.error("Failed to load blog:", err);
      error = err.message || "Failed to load blog";
      toast.error(err.message || "Failed to load blog");
    } finally {
      loading = false;
    }
  };

  const loadComments = async () => {
    try {
      const response = await commentApi.getCommentsByBlogId(parseInt(blogId));
      if (response.success && response.data) {
        comments = response.data;
      }
    } catch (err: any) {
      console.error("Failed to load comments:", err);
      // Don't show error toast for comments as it's not critical
    }
  };

  const handleSubmitComment = async () => {
    if (!currentUser) {
      toast.warning("Please login to comment");
      return;
    }

    commentError = "";

    const validation = validateCommentContent(newComment);
    if (!validation.isValid) {
      commentError = validation.error || "Invalid comment";
      return;
    }

    try {
      isSubmittingComment = true;
      const response = await commentApi.createComment(parseInt(blogId), newComment.trim());
      if (response.success) {
        toast.success("Comment added successfully!");
        await loadComments();
        newComment = "";
      }
    } catch (err: any) {
      console.error("Failed to submit comment:", err);
      
      // Check for verification requirement
      if (err.message?.includes("verif")) {
        toast.error("Please verify your email before commenting");
      } else {
        toast.error(err.message || "Failed to submit comment");
      }
    } finally {
      isSubmittingComment = false;
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await commentApi.deleteComment(parseInt(blogId), commentId);
      toast.success("Comment deleted successfully");
      await loadComments();
    } catch (err: any) {
      console.error("Failed to delete comment:", err);
      toast.error(err.message || "Failed to delete comment");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
      shareSuccess = true;
      setTimeout(() => (shareSuccess = false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };
</script>

<div class="max-w-7xl mx-auto px-4">
  {#if loading}
    <div class="space-y-4">
      <div class="h-10 bg-muted/50 rounded animate-pulse"></div>
      <div class="h-6 w-3/4 bg-muted/50 rounded animate-pulse"></div>
      <div class="h-96 bg-muted/50 rounded animate-pulse"></div>
    </div>
  {:else if blog}
    <!-- Back Button -->
    <Button variant="ghost" onclick={() => (window.location.href = "/blog")} className="mb-6">
      <ArrowLeft class="w-4 h-4 mr-2" />
      Back to Blogs
    </Button>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      <!-- Right Sidebar -->
      <aside class="space-y-6 lg:sticky lg:top-24 lg:self-start order-2">
        <!-- Author Card -->
        <div class="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 class="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">Author</h3>
          <div class="flex flex-col items-center text-center space-y-3">
            <Avatar
              src={blog.author?.profile?.avatar || undefined}
              fallback={blog.author?.name?.charAt(0) || "U"}
              class="w-20 h-20 border-2 border-primary/20"
            />
            <div>
              <p class="font-bold text-foreground">{blog.author?.name || "Unknown"}</p>
              <p class="text-xs text-muted-foreground">{blog.author?.email || ""}</p>
            </div>
          </div>
        </div>

        <!-- Meta Info Card -->
        <div class="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h3 class="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">Details</h3>
          
          <div class="flex items-center gap-3 text-sm">
            <Calendar class="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p class="text-xs text-muted-foreground">Published</p>
              <p class="font-medium">{formatDate(blog.createdAt)}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 text-sm">
            <MessageCircle class="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p class="text-xs text-muted-foreground">Comments</p>
              <p class="font-medium">{comments.length} comments</p>
            </div>
          </div>

          <Button variant="outline" onclick={handleShare} className="w-full mt-4">
            {#if shareSuccess}
              <Check class="w-4 h-4 mr-2" />
              Copied!
            {:else}
              <Share2 class="w-4 h-4 mr-2" />
              Share Article
            {/if}
          </Button>
        </div>

        <!-- Tags Card -->
        {#if blog.tags && blog.tags.length > 0}
          <div class="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 class="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">
              Tags ({blog.tags.length})
            </h3>
            <div class="flex flex-wrap gap-2">
              {#each blog.tags as tag}
                <Badge variant="secondary" class="px-3 py-1">{tag}</Badge>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Comments Summary Card -->
        <div class="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 class="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">
            Comments ({comments.length})
          </h3>
          <p class="text-sm text-muted-foreground">
            {#if comments.length === 0}
              No comments yet. Be the first!
            {:else if comments.length === 1}
              1 person has commented
            {:else}
              {comments.length} people have commented
            {/if}
          </p>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="order-1 max-w-3xl">
        <!-- Blog Header -->
        <div class="mb-8">
          <h1 class="text-4xl sm:text-5xl font-bold mb-4 text-foreground leading-tight">{blog.title}</h1>
        </div>

        <!-- Blog Content -->
        <div class="prose prose-lg dark:prose-invert max-w-none mb-12 bg-card border border-border rounded-xl p-8 shadow-sm">
          <div class="whitespace-pre-wrap">{blog.content}</div>
        </div>

        <!-- Comments Section -->
        <div class="bg-card border border-border rounded-xl p-8 shadow-sm">
          <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageCircle class="w-6 h-6" />
            Comments ({comments.length})
          </h2>

          {#if error}
            <div class="mb-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p class="text-destructive text-sm">{error}</p>
            </div>
          {/if}

          {#if currentUser && currentUser.isVerified}
            <div class="mb-8">
              <Textarea
                placeholder="Share your thoughts..."
                bind:value={newComment}
                class="mb-3"
              />
              <Button 
                onclick={handleSubmitComment}
                disabled={isSubmittingComment || !newComment.trim()}
              >
                <Send class="w-4 h-4 mr-2" />
                {isSubmittingComment ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          {:else if currentUser && !currentUser.isVerified}
            <div class="mb-8 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-lg">
              <p class="text-amber-800 dark:text-amber-200 text-sm font-medium">
                Please verify your email to post comments.
              </p>
            </div>
          {:else}
            <div class="mb-8 p-4 bg-muted border border-border rounded-lg">
              <p class="text-muted-foreground text-sm">
                Please <a href="/login" class="text-primary font-medium hover:underline">log in</a> to post comments.
              </p>
            </div>
          {/if}

          {#if comments.length > 0}
            <div class="space-y-4">
              {#each comments as comment}
                <div class="p-5 bg-muted/30 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <Avatar
                        src={undefined}
                        fallback={comment.user?.name?.charAt(0) || "U"}
                        class="w-10 h-10 border-2 border-primary/20"
                      />
                      <div>
                        <p class="font-bold text-sm">{comment.user?.name || "Unknown"}</p>
                        <p class="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                    {#if currentUser && (currentUser.id === comment.userId || currentUser.isOwner)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onclick={() => handleDeleteComment(comment.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash class="w-4 h-4" />
                      </Button>
                    {/if}
                  </div>
                  <p class="text-sm whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-border">
              <MessageCircle class="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p class="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
            </div>
          {/if}
        </div>
      </main>
    </div>
  {:else}
    <div class="text-center py-12">
      <h2 class="text-2xl font-bold mb-4">Blog not found</h2>
      <Button onclick={() => (window.location.href = "/blog")}>Back to Blogs</Button>
    </div>
  {/if}
</div>
