<script lang="ts">
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
  import { themeStore } from "./lib/theme";
  import { onMount } from "svelte";

  let currentPath = $state(window.location.pathname);
  let isAuthenticated = $state(false);
  let isOwner = $state(false);
  let isLoading = $state(true);

  // Initialize theme and auth on mount
  onMount(async () => {
    try {
      console.log('[Blog App] Initializing...');
      console.log('[Blog App] Current path:', window.location.pathname);
      themeStore.init();
      await authStore.init();
      updatePageSEO();
      console.log('[Blog App] Initialization complete');
    } catch (error) {
      console.error('[Blog App] Initialization error:', error);
    }
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
      
      // Redirect /blog to /blog/read
      if (currentPath === '/blog' || currentPath === '/blog/') {
        window.history.replaceState(null, '', '/blog/read');
        currentPath = '/blog/read';
      }
    };

    // Check on initial load - Fix for production deployment
    const checkPath = window.location.pathname;
    if (checkPath === '/blog' || checkPath === '/blog/' || checkPath === '' || checkPath === '/') {
      window.history.replaceState(null, '', '/blog/read');
      currentPath = '/blog/read';
    } else {
      currentPath = checkPath;
    }

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  });

  // Normalize path - remove /blog prefix if it exists
  const normalizedPath = $derived(() => {
    let path = currentPath;
    if (path.startsWith('/blog')) {
      path = path.substring(5) || '/read';
    }
    // If path is empty or just /, default to /read
    if (!path || path === '/') {
      path = '/read';
    }
    return path;
  });

  // Check if route requires authentication
  const requiresAuth = $derived(() => {
    const path = normalizedPath();
    return path === "/create" || 
           path === "/dashboard" || 
           path.endsWith("/edit");
  });

  // Redirect if trying to access protected route without auth
  $effect(() => {
    const basePath = '/blog';
    if (!isLoading && requiresAuth() && !isAuthenticated) {
      window.location.href = `${basePath}/login`;
    } else if (!isLoading && requiresAuth() && isAuthenticated && !isOwner && 
               (normalizedPath() === "/create" || normalizedPath() === "/dashboard" || normalizedPath().endsWith("/edit"))) {
      // Only owner can create/edit/dashboard
      window.location.href = `${basePath}/read`;
    }
  });

  // Determine which page to show
  const pageComponent = $derived(() => {
    const path = normalizedPath();
    if (path === "/login" || path === "/register") {
      return "login";
    } else if (path === "/" || path === "" || path === "/read") {
      return "list";
    } else if (path === "/create") {
      return "create";
    } else if (path === "/dashboard") {
      return "dashboard";
    } else if (path.match(/^\/read\/\d+\/edit$/)) {
      return "edit";
    } else if (path.match(/^\/read\/\d+$/)) {
      return "detail";
    }
    return "list";
  });

  const blogId = $derived(() => {
    const path = normalizedPath();
    // Match /read/123 or /read/123/edit format
    const match = path.match(/^\/read\/(\d+)(?:\/edit)?$/);
    return match ? match[1] : null;
  });

  // Update SEO based on current page
  function updatePageSEO() {
    const baseUrl = 'https://mishrashardendu22.is-a.dev/blog';
    
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
          title: 'Blogs By Shardendu Mishra | Tech Articles & Programming Insights',
          description: 'Explore in-depth technical articles about web development, software engineering, programming best practices, and modern tech stack insights.',
          url: `${baseUrl}/blog/read`,
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

<div class="min-h-screen bg-background" style="min-height: 100vh;">
  <!-- Toast Notifications -->
  <Toast />
  
  <!-- Theme Toggle -->
  <ThemeToggle />
  
  {#if isLoading}
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-background-secondary" style="min-height: 100vh;">
      <div class="text-center animate-slide-up">
        <div class="relative w-20 h-20 mx-auto mb-6">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div class="relative w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin shadow-lg"></div>
        </div>
        <p class="text-muted-foreground font-semibold text-lg">Loading...</p>
      </div>
    </div>
  {:else if pageComponent() === "login"}
    <LoginPage />
  {:else}
    <BlogNavigation />
    <main class="lg:ml-64">
      <div class="mx-auto pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 py-6 sm:py-8 max-w-7xl">
        {#if pageComponent() === "list"}
        <div class="space-y-6 sm:space-y-8 animate-slide-up">
          <div class="space-y-3 pb-4 border-b-2 border-border/50">
            <h1
              class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent drop-shadow-sm"
            >
              Blog Posts
            </h1>
            <p class="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed">
              Explore articles about web development, programming, and tech insights
            </p>
          </div>
          <BlogListPage />
        </div>
      {:else if pageComponent() === "create"}
        <div class="space-y-6 sm:space-y-8 animate-slide-up">
          <div class="space-y-3 pb-4 border-b-2 border-border/50">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Create New Post
            </h1>
            <p class="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed">
              Share your thoughts and insights with the world
            </p>
          </div>
          <BlogCreatePage />
        </div>
      {:else if pageComponent() === "dashboard"}
        <div class="space-y-6 sm:space-y-8 animate-slide-up">
          <div class="space-y-3 pb-4 border-b-2 border-border/50">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p class="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed">
              Manage your blog posts and view analytics
            </p>
          </div>
          <BlogDashboardPage />
        </div>
      {:else if pageComponent() === "detail" && blogId()}
        <BlogDetailPage blogId={blogId() || "1"} />
      {:else if pageComponent() === "edit" && blogId()}
        <div class="space-y-6 sm:space-y-8 animate-slide-up">
          <div class="space-y-3 pb-4 border-b-2 border-border/50">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Edit Post
            </h1>
            <p class="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed">
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
