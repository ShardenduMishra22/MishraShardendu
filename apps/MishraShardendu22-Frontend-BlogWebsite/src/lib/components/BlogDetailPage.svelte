<script lang="ts">
  import Button from "./ui/button.svelte";
  import Badge from "./ui/badge.svelte";
  import Avatar from "./ui/avatar.svelte";
  import Textarea from "./ui/textarea.svelte";
  import { Calendar, User, Share2, Check, MessageCircle, Send, Trash } from "lucide-svelte";
  import { marked } from "marked";
  import { blogApi, commentApi, type Blog, type Comment } from "../api";
  import { authStore } from "../auth";
  import { toast } from "../toast";
  import { validateCommentContent } from "../validation";
  import { updateSEO, generateBlogPostStructuredData, insertStructuredData, truncateDescription } from "../seo";
  import { getBasePath } from "../navigation";
  import { onMount } from "svelte";

  const basePath = getBasePath();
  import { resolveImageUrl } from "../utils/image";

  let { blogId }: { blogId: string } = $props();

  let blog = $state<Blog | null>(null);
  let renderedContent = $state<string>("");
  let comments = $state<Comment[]>([]);
  let loading = $state(true);
  let shareSuccess = $state(false);
  let error = $state("");
  let newComment = $state("");
  let isSubmittingComment = $state(false);
  let currentUser = $state<any>(null);
  let commentError = $state("");
  let showTags = $state(false);

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
        const result = marked(blog.content || "");
        if (result instanceof Promise) {
          result.then(html => { renderedContent = html; });
        } else {
          renderedContent = result;
        }
        
        const baseUrl = 'https://mishrashardendu22.is-a.dev';
        const blogUrl = `${baseUrl}/blog/read/${blogId}`;
        const description = truncateDescription(blog.content, 160);
        const authorName = blog.author?.name || 'Shardendu Mishra';
        const tags = Array.isArray(blog.tags) ? blog.tags : [];
        const keywords = tags.length > 0 
          ? `${tags.join(', ')}, programming, software development, tech article` 
          : 'programming, software development, tech article, coding tutorial';
        
        updateSEO({
          title: `${blog.title} | Shardendu Mishra Blog`,
          description: description,
          url: blogUrl,
          type: 'article',
          author: authorName,
          publishedTime: blog.createdAt,
          modifiedTime: blog.updatedAt,
          tags: tags,
          keywords: keywords,
        });

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

  // using shared resolveImageUrl from utils/image.ts

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

  const editUrl = $derived(() => {
    if (!blog) return '';
    return `${basePath}/read/${blog.id}/edit`;
  });
</script>

<div class="w-[100%]">
  {#if loading}
    <div class="space-y-4">
      <div class="h-10 bg-muted/50 rounded animate-pulse"></div>
      <div class="h-6 w-3/4 bg-muted/50 rounded animate-pulse"></div>
      <div class="h-96 bg-muted/50 rounded animate-pulse"></div>
    </div>
  {:else if blog}


  <div class="grid grid-cols-2 lg:grid-cols-[2fr_320px] gap-3 xl:gap-4">
  <!-- Main Content -->
      <main class="max-w-[100%]">
        <div class="mb-2">
          {#if blog.image}
            <div class="mb-2 rounded-lg overflow-hidden">
              <img src={resolveImageUrl(blog.image)} alt={blog.title} class="w-full h-64 sm:h-80 md:h-96 object-cover object-left shadow-lg" />
            </div>
          {/if}
          <h1 class="text-4xl sm:text-5xl font-bold mb-4 text-foreground leading-tight">{blog.title}</h1>
        </div>

  <!-- Article content -->
  <div class="w-full">
          <div class="prose prose-lg dark:prose-invert max-w-none mb-12">
            {@html renderedContent}
          </div>
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
              <div class="flex items-start gap-4 mb-3">
                <Avatar
                  src={resolveImageUrl(currentUser.profileImage || currentUser.image || currentUser.profile?.avatar || undefined)}
                  fallback={currentUser?.name?.charAt(0) || "U"}
                  class="w-10 h-10 border-2 border-primary/20"
                />
                <Textarea
                  placeholder="Share your thoughts..."
                  bind:value={newComment}
                  class="flex-1"
                />
              </div>
              <div class="flex items-center gap-3">
                <Button 
                  onclick={handleSubmitComment}
                  disabled={isSubmittingComment || !newComment.trim()}
                >
                  <Send class="w-4 h-4 mr-2" />
                  {isSubmittingComment ? "Posting..." : "Post Comment"}
                </Button>
              </div>
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
                Please <a href={`${basePath}/login`} class="text-primary font-medium hover:underline">log in</a> to post comments.
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
                                  src={resolveImageUrl(comment.user?.profileImage || comment.user?.image || comment.user?.profile?.avatar || undefined)}
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

      <!-- Sidebar -->
      <aside class="space-y-4 lg:sticky lg:top-8 lg:self-start min-w-[280px] max-w-[320px]">
        <div class="bg-card border border-border rounded-xl p-4 shadow-sm">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Author</h3>
          <div class="flex flex-col items-center text-center space-y-2">
            <Avatar
              src={resolveImageUrl(blog.author?.profileImage || blog.author?.image || blog.author?.avatar || blog.author?.profile?.avatar || undefined)}
              fallback={blog.author?.name?.charAt(0) || "U"}
              class="w-14 h-14 border-2 border-primary/20"
            />
            <div>
              <p class="font-semibold text-foreground text-sm">{blog.author?.name || "Unknown"}</p>
              <p class="text-[11px] text-muted-foreground">{blog.author?.email || ""}</p>
            </div>
          </div>
        </div>

        <!-- Meta Info Card -->
        <div class="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Details</h3>
          
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

          <Button variant="outline" onclick={handleShare} className="w-full mt-3">
            {#if shareSuccess}
              <Check class="w-4 h-4 mr-2" />
              Copied!
            {:else}
              <Share2 class="w-4 h-4 mr-2" />
              Share Article
            {/if}
          </Button>
          {#if blog && currentUser && (currentUser.isOwner || currentUser.id === blog.authorId) && editUrl()}
            <Button variant="secondary" onclick={() => (window.location.href = editUrl())} className="w-full mt-2">
              Edit Article
            </Button>
          {/if}
        </div>


        {#if blog.tags && blog.tags.length > 0}
          <div class="bg-card border border-border rounded-xl p-2 shadow-sm">
            <button
              type="button"
              class="w-full flex items-center justify-between px-3 py-2"
              aria-expanded={showTags}
              onclick={() => (showTags = !showTags)}
            >
              <h3 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tags ({blog.tags.length})</h3>
              <span class="text-xs text-muted-foreground">{showTags ? '▴' : '▾'}</span>
            </button>

            {#if showTags}
              <div class="px-3 pb-3 pt-1">
                <div class="flex flex-wrap gap-2">
                  {#each blog.tags as tag}
                    <Badge variant="secondary" class="text-xs px-2 py-0.5">{tag}</Badge>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </aside>
    </div>
  {:else}     
    <div class="text-center py-4">
      <h2 class="text-2xl font-bold mb-4">Blog not found</h2>
      <Button onclick={() => (window.location.href = `${basePath}/read`)}>Back to Blogs</Button>
    </div>
  {/if}
</div>

<style>
  /* Prevent markdown content from causing horizontal overflow */
  :global(.prose) {
    /* allow long words to break and wrap */
    overflow-wrap: anywhere;
    word-break: break-word;
  -webkit-hyphens: auto;
  hyphens: auto;
    -ms-word-break: break-word;
  }

  /* Make pre/code blocks wrap long lines and remain scrollable if needed */
  :global(.prose pre) {
    white-space: pre-wrap; /* wrap long lines */
    word-break: break-word;
    overflow: auto;
    padding: 0.75rem;
    border-radius: 0.5rem;
  }

  :global(.prose code) {
    word-break: break-word;
  }

  /* Ensure images and iframes inside prose scale within the constrained column */
  :global(.prose img),
  :global(.prose iframe) {
    max-width: 100%;
    height: auto;
  }
</style>