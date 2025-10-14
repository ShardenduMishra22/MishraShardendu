<script lang="ts">
  import Badge from "./ui/badge.svelte";
  import Avatar from "./ui/avatar.svelte";
  import Button from "./ui/button.svelte";
  import { MessageCircle, Calendar, ArrowRight, User } from "lucide-svelte";
  import { cn } from "../utils";

  import type { Blog as ApiBlog } from "../api";

  type Blog = ApiBlog;

  let {
    blog,
    onReadMore,
    customActions,
  }: {
    blog: Blog;
    onReadMore?: (blogId: string) => void;
    customActions?: any;
  } = $props();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };
</script>

<div class="group rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
  <div class="flex items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
    <div class="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
      <Avatar
        class="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300"
        src={blog.author?.profile?.avatar || undefined}
        fallback={blog.author?.name
          ? getInitials(blog.author.name, blog.author.name)
          : blog.author?.email?.charAt(0).toUpperCase() || "U"}
      />
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {blog.author?.name ? blog.author.name : blog.author?.email || "Unknown Author"}
        </p>
        <p class="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar class="w-3 h-3" />
          <span class="hidden sm:inline">{formatDate(blog.createdAt)}</span>
          <span class="sm:hidden">
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </p>
      </div>
    </div>

    <div class="flex items-center gap-1 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors">
      <MessageCircle class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <span class="text-xs font-medium">{blog.comments ?? 0}</span>
    </div>
  </div>

  <h4 class="text-sm sm:text-base font-bold text-foreground mb-3 sm:mb-4 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
    {blog.title}
  </h4>

  {#if blog.tags && blog.tags.length > 0}
    <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
      {#each blog.tags.slice(0, 3) as tag}
        <Badge variant="secondary" class="text-xs px-2 sm:px-2.5 py-0.5 font-medium shadow-sm hover:shadow-md transition-shadow">
          {tag}
        </Badge>
      {/each}
      {#if blog.tags.length > 3}
        <Badge variant="outline" class="text-xs px-2 sm:px-2.5 py-0.5 font-medium">
          +{blog.tags.length - 3}
        </Badge>
      {/if}
    </div>
  {/if}

  {#if customActions}
    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onclick={() => onReadMore?.(blog.id.toString())}
        className="flex-1 text-xs sm:text-sm group/btn relative overflow-hidden h-9 sm:h-10 font-semibold border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300"
      >
        <span
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"
        ></span>
        <span class="relative flex items-center justify-center gap-1.5 sm:gap-2">
          <span class="hidden sm:inline">Continue Reading</span>
          <span class="sm:hidden">Read</span>
          <ArrowRight
            class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
          />
        </span>
      </Button>
      {@render customActions?.()}
    </div>
  {:else}
    <Button
      variant="outline"
      size="sm"
      onclick={() => onReadMore?.(blog.id.toString())}
      className="w-full text-xs sm:text-sm group/btn relative overflow-hidden h-9 sm:h-10 font-semibold border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300"
    >
      <span
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"
      ></span>
      <span class="relative flex items-center justify-center gap-1.5 sm:gap-2">
        <span class="hidden sm:inline">Continue Reading</span>
        <span class="sm:hidden">Read More</span>
        <ArrowRight
          class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
        />
      </span>
    </Button>
  {/if}
</div>
