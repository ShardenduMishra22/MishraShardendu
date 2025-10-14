<script lang="ts">
  import "./app.css";
  import BlogNavigation from "./lib/components/BlogNavigation.svelte";
  import BlogListPage from "./lib/components/BlogListPage.svelte";
  import BlogCreatePage from "./lib/components/BlogCreatePage.svelte";
  import BlogDetailPage from "./lib/components/BlogDetailPage.svelte";
  import BlogDashboardPage from "./lib/components/BlogDashboardPage.svelte";
  import LoginPage from "./lib/components/LoginPage.svelte";
  import Toast from "./lib/components/Toast.svelte";
  import ThemeToggle from "./lib/components/ThemeToggle.svelte";
  import { authStore } from "./lib/auth";
  import { updateSEO } from "./lib/seo";
  import { onMount } from "svelte";

  let currentPath = $state(window.location.pathname);
  let isAuthenticated = $state(false);
  let isOwner = $state(false);
  let isLoading = $state(true);

  // Initialize auth on mount
  onMount(async () => {
    await authStore.init();
    updatePageSEO();
  });

  // Subscribe to auth changes
  authStore.subscribe((state) => {
    isAuthenticated = state.isAuthenticated;
    isOwner = state.user?.isOwner || false;
    isLoading = state.isLoading;
  });

  // Listen for navigation changes
  $effect(() => {
    const handleLocationChange = () => {
      currentPath = window.location.pathname;
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  });

  // Check if route requires authentication
  const requiresAuth = $derived(() => {
    return currentPath === "/blog/create" || 
           currentPath === "/blog/dashboard" || 
           currentPath.endsWith("/edit");
  });

  // Redirect if trying to access protected route without auth
  $effect(() => {
    if (!isLoading && requiresAuth() && !isAuthenticated) {
      window.location.href = "/blog/login";
    } else if (!isLoading && requiresAuth() && isAuthenticated && !isOwner && 
               (currentPath === "/blog/create" || currentPath === "/blog/dashboard" || currentPath.endsWith("/edit"))) {
      // Only owner can create/edit/dashboard
      window.location.href = "/blog";
    }
  });

  // Determine which page to show
  const pageComponent = $derived(() => {
    if (currentPath === "/blog/login" || currentPath === "/blog/register") {
      return "login";
    } else if (currentPath === "/" || currentPath === "/blog" || currentPath === "/blog/") {
      return "list";
    } else if (currentPath === "/blog/create") {
      return "create";
    } else if (currentPath === "/blog/dashboard") {
      return "dashboard";
    } else if (currentPath.startsWith("/blog/") && currentPath.endsWith("/edit")) {
      return "edit";
    } else if (currentPath.startsWith("/blog/")) {
      return "detail";
    }
    return "list";
  });

  const blogId = $derived(() => {
    const match = currentPath.match(/\/blog\/(\d+)/);
    return match ? match[1] : null;
  });

  // Update SEO based on current page
  function updatePageSEO() {
    const baseUrl = 'https://blog.mishrashardendu22.is-a.dev';
    
    switch (pageComponent()) {
      case 'login':
        updateSEO({
          title: 'Login - Shardendu Mishra Blog',
          description: 'Sign in to access your blog dashboard and create new posts.',
          url: `${baseUrl}/blog/login`,
        });
        break;
      case 'list':
        updateSEO({
          title: 'Blog - Shardendu Mishra | Tech Articles & Programming Insights',
          description: 'Explore in-depth technical articles about web development, software engineering, programming best practices, and modern tech stack insights.',
          url: `${baseUrl}/blog`,
        });
        break;
      case 'create':
        updateSEO({
          title: 'Create New Post - Shardendu Mishra Blog',
          description: 'Create and publish a new blog post to share your technical insights.',
          url: `${baseUrl}/blog/create`,
        });
        break;
      case 'dashboard':
        updateSEO({
          title: 'Dashboard - Shardendu Mishra Blog',
          description: 'Manage your blog posts, view analytics, and monitor engagement.',
          url: `${baseUrl}/blog/dashboard`,
        });
        break;
      case 'edit':
        updateSEO({
          title: 'Edit Post - Shardendu Mishra Blog',
          description: 'Edit and update your blog post content.',
          url: `${baseUrl}${currentPath}`,
        });
        break;
      case 'detail':
        // SEO will be updated by BlogDetailPage component with specific post data
        updateSEO({
          title: 'Blog Post - Shardendu Mishra',
          description: 'Read this technical article by Shardendu Mishra.',
          url: `${baseUrl}${currentPath}`,
          type: 'article',
        });
        break;
      default:
        updateSEO();
    }
  }

  // Update SEO when route changes
  $effect(() => {
    if (!isLoading) {
      updatePageSEO();
    }
  });
</script>

<div class="min-h-screen bg-background">
  <!-- Toast Notifications -->
  <Toast />
  
  <!-- Theme Toggle -->
  <ThemeToggle />
  
  {#if isLoading}
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-muted-foreground">Loading...</p>
      </div>
    </div>
  {:else if pageComponent() === "login"}
    <LoginPage />
  {:else}
    <BlogNavigation />
    <main class="lg:ml-64">
      <div class="mx-auto pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 py-6 sm:py-8 max-w-7xl">
        {#if pageComponent() === "list"}
        <div class="space-y-4 sm:space-y-6">
          <div class="space-y-2">
            <h1
              class="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            >
              Blog Posts
            </h1>
            <p class="text-base sm:text-lg text-muted-foreground">
              Explore articles about web development, programming, and tech insights
            </p>
          </div>
          <BlogListPage />
        </div>
      {:else if pageComponent() === "create"}
        <div class="space-y-4 sm:space-y-6">
          <div class="space-y-2">
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Create New Post
            </h1>
            <p class="text-base sm:text-lg text-muted-foreground">
              Share your thoughts and insights with the world
            </p>
          </div>
          <BlogCreatePage />
        </div>
      {:else if pageComponent() === "dashboard"}
        <div class="space-y-4 sm:space-y-6">
          <div class="space-y-2">
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p class="text-base sm:text-lg text-muted-foreground">
              Manage your blog posts and view analytics
            </p>
          </div>
          <BlogDashboardPage />
        </div>
      {:else if pageComponent() === "detail" && blogId()}
        <BlogDetailPage blogId={blogId() || "1"} />
      {:else if pageComponent() === "edit" && blogId()}
        <div class="space-y-4 sm:space-y-6">
          <div class="space-y-2">
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Edit Post
            </h1>
            <p class="text-base sm:text-lg text-muted-foreground">
              Update your blog post content
            </p>
          </div>
          <BlogCreatePage />
        </div>
        {/if}
      </div>
    </main>
  {/if}
</div>
