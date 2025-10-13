<script lang="ts">
  import { cn } from "../utils";
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

  const navigationItems = [
    {
      name: "Read Blogs",
      href: "/blog",
      icon: Glasses,
      description: "Read the latest blog posts",
      showForAll: true,
    },
    {
      name: "Dashboard",
      href: "/blog/dashboard",
      icon: LayoutDashboard,
      description: "Manage your blog posts",
      showForAll: false,
    },
    {
      name: "Create Post",
      href: "/blog/create",
      icon: Plus,
      description: "Write a new blog post",
      showForAll: false,
    },
    {
      name: "Main Website",
      href: "/",
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
    if (href === "/blog") {
      if (currentPath === "/blog/dashboard" || currentPath === "/blog/create") {
        return false;
      }
      return (
        currentPath === "/blog" ||
        (currentPath.startsWith("/blog/") &&
          !currentPath.includes("/dashboard") &&
          !currentPath.includes("/create"))
      );
    }

    if (href === "/blog/dashboard") {
      return currentPath === "/blog/dashboard";
    }
    if (href === "/blog/create") {
      return currentPath === "/blog/create";
    }

    return currentPath === href;
  };
</script>

<!-- Mobile Menu Toggle -->
<div class="lg:hidden fixed top-4 right-4 z-50">
  <Button
    variant="outline"
    size="sm"
    onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
    className="bg-background border-border"
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
  <div class="lg:hidden fixed inset-0 z-40 bg-background">
    <div class="flex flex-col justify-center items-center h-full space-y-3 p-6">
      {#if isAuthenticated && user}
        <!-- Unified User Card - Mobile -->
        <div class="w-full max-w-md bg-gradient-to-br from-card to-muted/30 rounded-xl p-4 border border-border shadow-xl mb-2">
          <div class="flex items-center gap-3 mb-3">
            <div class="relative">
              <Avatar
                src={undefined}
                fallback={user.name?.charAt(0) || "U"}
                class="w-12 h-12 border-2 border-primary/20"
              />
              {#if user.isVerified}
                <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
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
                <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/50 px-1.5 py-0.5 rounded-md mt-1">
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
            "flex items-center gap-3 w-full max-w-md p-4 rounded-lg border transition-colors duration-200",
            isActive
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border hover:border-primary/50"
          )}
        >
          {#if item.icon}
            {@const Icon = item.icon}
            <Icon class="h-5 w-5 flex-shrink-0" />
          {/if}
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-sm">{item.name}</div>
            <div class="text-xs opacity-80 truncate">{item.description}</div>
          </div>
        </a>
      {/each}

      {#if isAuthenticated && user}
        <div class="w-full max-w-md">
          <Button
            variant="outline"
            className="w-full h-12 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800 transition-all group"
            onclick={() => authStore.logout()}
          >
            <LogOut class="h-5 w-5 mr-2 group-hover:animate-pulse" />
            <span class="font-semibold">Sign Out</span>
          </Button>
        </div>
      {:else}
        <div class="w-full max-w-md">
          <Button
            className="w-full h-12 shadow-lg"
            onclick={() => window.location.href = "/login"}
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
  class="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-card flex-col z-30"
>
  <div class="p-6 border-b border-border">
    <div class="flex items-center gap-3">
      <div class="p-2 rounded-xl bg-primary/10">
        <BookOpen class="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 class="font-bold text-lg">Blog</h1>
        <p class="text-xs text-muted-foreground">Shardendu Mishra</p>
      </div>
    </div>
  </div>

  <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
    {#each visibleNavItems as item}
      {@const isActive = isRouteActive(item.href)}
      <a
        href={item.href}
        class={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
          isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "hover:bg-accent text-foreground hover:text-accent-foreground"
        )}
      >
        {#if item.icon}
          {@const Icon = item.icon}
          <Icon
            class={cn(
              "h-5 w-5 flex-shrink-0 transition-transform duration-200",
              isActive ? "scale-110" : "group-hover:scale-110"
            )}
          />
        {/if}
        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm">{item.name}</div>
          <div
            class={cn(
              "text-xs truncate",
              isActive ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {item.description}
          </div>
        </div>
      </a>
    {/each}
  </nav>

  <div class="p-3 border-t border-border">
    {#if isAuthenticated && user}
      <!-- Unified User Card -->
      <div class="bg-gradient-to-br from-card to-muted/30 rounded-xl p-4 border border-border shadow-lg">
        <!-- User Info Section -->
        <div class="flex items-center gap-3 mb-3">
          <div class="relative">
            <Avatar
              src={undefined}
              fallback={user.name?.charAt(0) || "U"}
              class="w-12 h-12 border-2 border-primary/20"
            />
            {#if user.isVerified}
              <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
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
              <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/50 px-1.5 py-0.5 rounded-md mt-1">
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
          className="w-full h-9 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800 transition-all group" 
          onclick={() => authStore.logout()}
        >
          <LogOut class="w-4 h-4 mr-2 group-hover:animate-pulse" />
          Sign Out
        </Button>
      </div>
    {:else}
      <!-- Sign In Card -->
      <div class="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20 shadow-md">
        <Button 
          size="default" 
          className="w-full h-10 shadow-sm" 
          onclick={() => window.location.href = "/login"}
        >
          <LogIn class="w-4 h-4 mr-2" />
          Sign In to Continue
        </Button>
      </div>
    {/if}
  </div>
</aside>
