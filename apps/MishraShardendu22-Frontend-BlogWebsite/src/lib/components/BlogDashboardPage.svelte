<script lang="ts">
  import Button from "./ui/button.svelte";
  import Input from "./ui/input.svelte";
  import Card from "./ui/card.svelte";
  import Badge from "./ui/badge.svelte";
  import {
    BookOpen,
    Plus,
    Search,
    MessageCircle,
    Trash2,
    BarChart3,
    Edit,
  } from "lucide-svelte";
  import BlogCard from "./BlogCard.svelte";
  import { cn } from "../utils";
  import { blogApi, statsApi, type Blog, type BlogStats } from "../api";
  import { authStore } from "../auth";
  import { getBasePath } from "../navigation";
  import { onMount } from "svelte";
  import resolveImageUrl from "../utils/image"

  const basePath = getBasePath();

  let blogs = $state<Blog[]>([]);
  let stats = $state<BlogStats>({ 
    totalBlogs: 0, 
    totalComments: 0,
    recentPosts: [],
    popularTags: []
  });
  let searchTerm = $state("");
  let deletingBlogId = $state<number | null>(null);
  let loading = $state(true);
  let error = $state("");

  onMount(async () => {
    await loadData();
  });

  const loadData = async () => {
    try {
      loading = true;
      error = "";
      
      // Load blogs and stats in parallel
      const [blogsResponse, statsResponse] = await Promise.all([
        blogApi.getAllBlogs(),
        statsApi.getBlogStats(),
      ]);

      if (blogsResponse.success && blogsResponse.data) {
        blogs = blogsResponse.data;
      }

      if (statsResponse.success && statsResponse.data) {
        stats = statsResponse.data;
      }
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err);
      error = err.message || "Failed to load dashboard data";
    } finally {
      loading = false;
    }
  };

  const filteredBlogs = $derived(
    blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalComments = $derived(stats.totalComments);

  const handleDelete = async (blogId: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      deletingBlogId = blogId;
      await blogApi.deleteBlog(blogId);
      await loadData();
    } catch (err: any) {
      console.error("Failed to delete blog:", err);
      error = err.message || "Failed to delete blog";
    } finally {
      deletingBlogId = null;
    }
  };
</script>

<div class="space-y-3 md:space-y-4">
  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
    <Card class="p-12">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted-foreground">Total Posts</p>
          <p class="text-3xl font-bold">{blogs.length}</p>
        </div>
        <div class="p-3 bg-primary/10 rounded-lg">
          <BookOpen class="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>

    <Card class="p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted-foreground">Total Comments</p>
          <p class="text-3xl font-bold">{totalComments}</p>
        </div>
        <div class="p-3 bg-blue-500/10 rounded-lg">
          <MessageCircle class="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </Card>

    <Card class="p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted-foreground">Avg. Comments</p>
          <p class="text-3xl font-bold">
            {blogs.length > 0 ? (totalComments / blogs.length).toFixed(1) : "0"}
          </p>
        </div>
        <div class="p-3 bg-green-500/10 rounded-lg">
          <BarChart3 class="w-6 h-6 text-green-500" />
        </div>
      </div>
    </Card>
  </div>

  <!-- Search and Actions -->
  <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
    <div class="relative flex-1">
      <Search
        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5"
      />
      <Input
        placeholder="Search your posts..."
        bind:value={searchTerm}
        class="pl-10 h-11"
      />
    </div>
    <Button
      onclick={() => (window.location.href = `${basePath}/create`)}
      className="h-11 px-6 sm:w-auto"
    >
      <Plus class="w-5 h-5 mr-2" />
      Create Post
    </Button>
  </div>

  <!-- Blog List -->
  {#if filteredBlogs.length === 0}
    <div class="text-center py-12">
      <BookOpen class="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h3 class="text-xl font-semibold mb-2">No posts found</h3>
      <p class="text-muted-foreground mb-6">
        {searchTerm ? "Try a different search term" : "Create your first blog post"}
      </p>
      {#if !searchTerm}
        <Button onclick={() => (window.location.href = `${basePath}/create`)}>
          <Plus class="w-4 h-4 mr-2" />
          Create First Post
        </Button>
      {/if}
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {#each filteredBlogs as blog (blog.id)}
        <div class="rounded-lg border border-border bg-card p-4 sm:p-5 lg:p-6">
          <div class="mb-4 flex items-start gap-3">
            {#if blog.image}
              <img src={resolveImageUrl(blog.image)} alt={blog.title} class="w-16 h-10 object-cover rounded-md flex-shrink-0 sm:hidden" />
            {/if}
            <h4 class="text-sm sm:text-base font-semibold text-foreground mb-2 line-clamp-2">
              {blog.title}
            </h4>
            {#if blog.tags && blog.tags.length > 0}
              <div class="flex flex-wrap gap-1 sm:gap-1.5 mb-2">
                {#each blog.tags.slice(0, 3) as tag}
                  <Badge variant="secondary" class="text-xs px-1.5 sm:px-2 py-0.5">
                    {tag}
                  </Badge>
                {/each}
              </div>
            {/if}
          </div>
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onclick={() => (window.location.href = `${basePath}/read/${blog.id}`)}
              class="flex-1"
            >
              View
            </Button>
              <Button
                variant="outline"
                size="sm"
                onclick={() => (window.location.href = `${basePath}/read/${blog.id}/edit`)}
                className=""
              >
                <Edit class="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onclick={() => handleDelete(blog.id)}
                disabled={deletingBlogId === blog.id}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
