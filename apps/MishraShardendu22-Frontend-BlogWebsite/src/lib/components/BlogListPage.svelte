<script lang="ts">
  import Button from "./ui/button.svelte";
  import Input from "./ui/input.svelte";
  import { BookOpen, Plus, Search } from "lucide-svelte";
  import BlogCard from "./BlogCard.svelte";
  import { cn } from "../utils";
  import { blogApi, type Blog } from "../api";
  import { authStore } from "../auth";
  import { onMount } from "svelte";

  // Get auth state
  let isOwner = $state(false);
  let blogs = $state<Blog[]>([]);
  let loading = $state(true);
  let searchTerm = $state("");
  let error = $state("");

  // Subscribe to auth store
  authStore.subscribe((state) => {
    isOwner = state.user?.isOwner || false;
  });

  // Fetch blogs on mount
  onMount(async () => {
    await loadBlogs();
  });

  const loadBlogs = async () => {
    try {
      loading = true;
      error = "";
      const response = await blogApi.getAllBlogs();
      if (response.success && response.data) {
        blogs = response.data;
      }
    } catch (err: any) {
      console.error("Failed to load blogs:", err);
      error = err.message || "Failed to load blogs";
    } finally {
      loading = false;
    }
  };

  const filteredBlogs = $derived(
    blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
</script>

<div class="space-y-6 md:space-y-8">
  {#if error}
    <div class="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
      <p class="text-destructive text-sm">{error}</p>
    </div>
  {/if}

  <!-- Search and Create Post Section -->
  <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
    <div class="relative flex-1 min-w-0">
      <Search
        class="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5 pointer-events-none z-10"
      />
      <Input
        placeholder="Search blogs..."
        bind:value={searchTerm}
        class="pl-10 sm:pl-12 pr-20 sm:pr-24 h-11 sm:h-12 bg-card/60 backdrop-blur-sm border-border/60 focus:border-primary/40 hover:border-border focus:ring-2 focus:ring-primary/10 rounded-xl text-sm sm:text-base text-foreground placeholder:text-muted-foreground transition-all duration-300 shadow-sm w-full"
      />
      <div
        class="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
      >
        <span
          class="text-xs font-semibold bg-primary/15 text-primary px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-primary/30 shadow-sm whitespace-nowrap"
        >
          {filteredBlogs.length}
        </span>
      </div>
    </div>

    {#if isOwner}
      <Button
        onclick={() => (window.location.href = "/blog/create")}
        className="h-11 sm:h-12 px-4 sm:px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl shadow-primary/20 transition-all duration-300 gap-2 rounded-xl text-sm sm:text-base flex-shrink-0 w-full sm:w-auto"
      >
        <Plus class="w-4 h-4 sm:w-5 sm:h-5" />
        <span class="hidden xs:inline">Create Post</span>
        <span class="xs:hidden">Create</span>
      </Button>
    {/if}
  </div>

  {#if loading}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
      {#each Array(6) as _, i}
        <div
          class="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm p-4 space-y-4"
        >
          <div class="w-10 h-10 bg-muted/50 rounded-full animate-pulse"></div>
          <div class="h-5 w-5/6 bg-muted/50 rounded animate-pulse"></div>
          <div class="h-4 w-full bg-muted/50 rounded animate-pulse"></div>
          <div class="flex gap-2">
            <div class="h-6 w-16 bg-muted/50 rounded-full animate-pulse"></div>
            <div class="h-6 w-20 bg-muted/50 rounded-full animate-pulse"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else if filteredBlogs.length === 0}
    <div class="text-center py-12 sm:py-16 md:py-24 px-4">
      <div class="relative w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 sm:mb-8">
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 rounded-3xl blur-2xl animate-pulse"
        ></div>
        <div
          class="relative w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/5 rounded-3xl flex items-center justify-center shadow-xl border border-primary/10"
        >
          <BookOpen class="w-10 h-10 sm:w-14 sm:h-14 text-primary" />
        </div>
      </div>
      <h3 class="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
        {searchTerm ? "No blogs found" : "No blogs yet"}
      </h3>
      <p class="text-muted-foreground text-sm sm:text-base mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed px-4">
        {searchTerm
          ? "Try adjusting your search terms or browse all blogs"
          : "Create your first blog post to share your thoughts and insights with the world"}
      </p>
      {#if !searchTerm && isOwner}
        <Button
          onclick={() => (window.location.href = "/blog/create")}
          className="h-11 sm:h-12 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl shadow-primary/20 transition-all duration-300 gap-2 sm:gap-2.5 rounded-xl text-sm sm:text-base"
        >
          <Plus class="w-4 h-4 sm:w-5 sm:h-5" />
          Create First Post
        </Button>
      {/if}
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
      {#each filteredBlogs as blog (blog.id)}
        <BlogCard {blog} onReadMore={(blogId) => (window.location.href = `/blog/${blogId}`)} />
      {/each}
    </div>
  {/if}
</div>
