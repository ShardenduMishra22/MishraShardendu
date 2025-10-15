<script lang="ts">
  import { cn } from "../utils";
  import { getBasePath } from "../navigation";
  import Button from "./ui/button.svelte";
  import Avatar from "./ui/avatar.svelte";
  import CompactEmailVerification from "./CompactEmailVerification.svelte";
  import { BookOpen, Plus, LogOut, Menu, X, Glasses, LayoutDashboard, User2, LogIn } from "lucide-svelte";
  import { authStore } from "../auth";
  import type { User } from "../api";

  let isMobileMenuOpen = $state(false);
  let currentPath = $state(window.location.pathname);
  let isOwner = $state(false);
  let user = $state<User | null>(null);
  let isAuthenticated = $state(false);

  // Subscribe to auth store
  authStore.subscribe((state) => {
    isOwner = state.user?.isOwner || false;
    user = state.user;
    isAuthenticated = state.isAuthenticated;
  });

  // Update current path on location change
  $effect(() => {
    currentPath = window.location.pathname;
  });

  // Determine base path (works for both standalone and microfrontend)
  const basePath = getBasePath();

  const navigationItems = [
    {
      name: "Read Blogs",
      href: basePath ? `${basePath}/read` : "/",
      icon: Glasses,
      description: "Read the latest blog posts",
      showForAll: true,
    },
    {
      name: "Dashboard",
      href: `${basePath}/dashboard`,
      icon: LayoutDashboard,
      description: "Manage your blog posts",
      showForAll: false,
    },
    {
      name: "Create Post",
      href: `${basePath}/create`,
      icon: Plus,
      description: "Write a new blog post",
      showForAll: false,
    },
    {
      name: "Main Website",
      href: basePath ? "/" : "https://mishrashardendu22.is-a.dev",
      icon: User2,
      description: "Go back to the main website",
      showForAll: true,
    },
  ];

  const visibleNavItems = navigationItems.filter((item) => {
    if (item.showForAll) return true;
    return isOwner;
  });

  const isRouteActive = (href: string) => {
    // "Main Website" link should never be active when we're in the blog app
    if (href === "/" || href === "https://mishrashardendu22.is-a.dev") {
      return false;
    }

    // Normalize both paths for comparison
    const normalizedCurrent = currentPath.startsWith('/blog') 
      ? currentPath.substring(5) || '/read' 
      : currentPath;
    const normalizedHref = href.startsWith('/blog') 
      ? href.substring(5) || '/read' 
      : href;

    // Home/List/Read page
    if (normalizedHref === "/read") {
      if (normalizedCurrent === "/dashboard" || normalizedCurrent === "/create") {
        return false;
      }
      return (
        normalizedCurrent === "/" ||
        normalizedCurrent === "" ||
        normalizedCurrent === "/read" ||
        (normalizedCurrent.match(/^\/read\/\d+/) &&
          !normalizedCurrent.includes("/dashboard") &&
          !normalizedCurrent.includes("/create"))
      );
    }

    if (normalizedHref === "/dashboard") {
      return normalizedCurrent === "/dashboard";
    }
    if (normalizedHref === "/create") {
      return normalizedCurrent === "/create";
    }

    return normalizedCurrent === normalizedHref;
  };
</script>

<!-- Mobile Menu Toggle -->
<div class="lg:hidden fixed top-4 right-4 z-50">
  <Button
    variant="outline"
    size="sm"
    onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
    className="bg-card/95 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
  >
    {#if isMobileMenuOpen}
      <X class="h-4 w-4" />
    {:else}
      <Menu class="h-4 w-4" />
    {/if}
  </Button>
</div>

<!-- Mobile Menu -->
{#if isMobileMenuOpen}
  <div class="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md">
    <div class="flex flex-col justify-center items-center h-full space-y-3 p-6 animate-slide-up">
      {#if isAuthenticated && user}
        <!-- Unified User Card - Mobile -->
        <div class="w-full max-w-md bg-gradient-to-br from-card to-muted/30 rounded-xl p-4 border border-border shadow-2xl mb-2">
          <div class="flex items-center gap-3 mb-3">
            <div class="relative">
              <Avatar
                src={user.profileImage || user.image || user.avatar || user.profile?.avatar || undefined}
                fallback={user.name?.charAt(0) || "U"}
                class="w-12 h-12 border-2 border-primary/20 shadow-md"
              />
              {#if user.isVerified}
                <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center shadow-sm">
                  <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
              {/if}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold truncate">{user.name}</p>
              <p class="text-xs text-muted-foreground truncate">{user.email}</p>
              {#if !user.isVerified}
                <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/50 px-1.5 py-0.5 rounded-md mt-1 shadow-sm">
                  <span class="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
                  Email not verified
                </span>
              {/if}
            </div>
          </div>
          {#if !user.isVerified}
            <div class="mb-3 pt-3 border-t border-border/50">
              <CompactEmailVerification email={user.email} />
            </div>
          {/if}
        </div>
      {/if}

      {#each visibleNavItems as item}
        {@const isActive = isRouteActive(item.href)}
        <a
          href={item.href}
          onclick={() => (isMobileMenuOpen = false)}
          class={cn(
            "flex items-center gap-3 w-full max-w-md p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden",
            isActive
              ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]"
              : "bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 hover:shadow-md hover:scale-[1.02]"
          )}
        >
          <span class={cn(
            "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700",
            isActive && "opacity-0"
          )}></span>
          {#if item.icon}
            {@const Icon = item.icon}
            <Icon class={cn(
              "h-5 w-5 flex-shrink-0 relative z-10 transition-all duration-300",
              isActive ? "scale-110 drop-shadow-sm" : "group-hover:scale-110 group-hover:text-primary group-hover:rotate-3"
            )} />
          {/if}
          <div class="flex-1 min-w-0 relative z-10">
            <div class={cn("font-semibold text-sm", isActive && "drop-shadow-sm")}>{item.name}</div>
            <div class={cn(
              "text-xs truncate transition-colors",
              isActive ? "text-primary-foreground/80" : "text-muted-foreground group-hover:text-foreground/70"
            )}>{item.description}</div>
          </div>
          {#if isActive}
            <div class="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground/20 rounded-full"></div>
          {/if}
        </a>
      {/each}

      {#if isAuthenticated && user}
        <div class="w-full max-w-md">
          <Button
            variant="outline"
            className="w-full h-12 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800 transition-all duration-300 group shadow-md hover:shadow-lg"
            onclick={() => authStore.logout()}
          >
            <LogOut class="h-5 w-5 mr-2 group-hover:animate-pulse" />
            <span class="font-semibold">Sign Out</span>
          </Button>
        </div>
      {:else}
        <div class="w-full max-w-md">
          <Button
            className="w-full h-12 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/90"
            onclick={() => window.location.href = `${basePath}/login`}
          >
            <LogIn class="h-5 w-5 mr-2" />
            <span class="font-semibold">Sign In to Continue</span>
          </Button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Desktop Sidebar -->
<aside
  class="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-card/95 backdrop-blur-sm flex-col z-30 shadow-lg"
>
  <div class="p-6 border-b border-border bg-gradient-to-b from-background/50 to-transparent">
    <div class="flex items-center gap-3">
      <div class="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
        <BookOpen class="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 class="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Blog</h1>
        <p class="text-xs text-muted-foreground font-medium">Shardendu Mishra</p>
      </div>
    </div>
  </div>

  <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
    {#each visibleNavItems as item}
      {@const isActive = isRouteActive(item.href)}
      <a
        href={item.href}
        class={cn(
          "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
          isActive
            ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
            : "hover:bg-gradient-to-r hover:from-accent/10 hover:to-accent/5 text-foreground hover:shadow-md border border-transparent hover:border-border/50 hover:scale-[1.01]"
        )}
      >
        <span class={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700",
          isActive && "opacity-0"
        )}></span>
        {#if item.icon}
          {@const Icon = item.icon}
          <Icon
            class={cn(
              "h-5 w-5 flex-shrink-0 transition-all duration-300 relative z-10",
              isActive ? "scale-110 drop-shadow-sm" : "group-hover:scale-110 group-hover:text-primary group-hover:rotate-3"
            )}
          />
        {/if}
        <div class="flex-1 min-w-0 relative z-10">
          <div class={cn("font-semibold text-sm transition-colors", isActive && "drop-shadow-sm")}>{item.name}</div>
          <div
            class={cn(
              "text-xs truncate transition-colors",
              isActive ? "text-primary-foreground/80" : "text-muted-foreground group-hover:text-foreground/70"
            )}
          >
            {item.description}
          </div>
        </div>
        {#if isActive}
          <div class="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground/20 rounded-full"></div>
        {/if}
      </a>
    {/each}
  </nav>

  <div class="p-3 border-t border-border bg-gradient-to-t from-background/50 to-transparent">
    {#if isAuthenticated && user}
      <!-- Unified User Card -->
      <div class="bg-gradient-to-br from-card to-muted/30 rounded-xl p-4 border border-border shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <!-- User Info Section -->
        <div class="flex items-center gap-3 mb-3">
          <div class="relative">
            <Avatar
              src={user.profileImage || user.image || user.avatar || user.profile?.avatar || undefined}
              fallback={user.name?.charAt(0) || "U"}
              class="w-12 h-12 border-2 border-primary/20 shadow-md"
            />
            {#if user.isVerified}
              <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center shadow-sm">
                <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
            {/if}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold truncate text-foreground">{user.name}</p>
            <p class="text-xs text-muted-foreground truncate">{user.email}</p>
            {#if !user.isVerified}
              <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/50 px-1.5 py-0.5 rounded-md mt-1 shadow-sm">
                <span class="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
                Email not verified
              </span>
            {/if}
          </div>
        </div>
        
        <!-- Verification Section -->
        {#if !user.isVerified}
          <div class="mb-3 pt-3 border-t border-border/50">
            <CompactEmailVerification email={user.email} />
          </div>
        {/if}
        
        <!-- Sign Out Button -->
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full h-9 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800 transition-all duration-300 group shadow-sm hover:shadow-md" 
          onclick={() => authStore.logout()}
        >
          <LogOut class="w-4 h-4 mr-2 group-hover:animate-pulse" />
          Sign Out
        </Button>
      </div>
    {:else}
      <!-- Sign In Card -->
      <div class="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <Button 
          size="default" 
          className="w-full h-10 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-primary/90" 
          onclick={() => window.location.href = `${basePath}/login`}
        >
          <LogIn class="w-4 h-4 mr-2" />
          Sign In to Continue
        </Button>
      </div>
    {/if}
  </div>
</aside>
