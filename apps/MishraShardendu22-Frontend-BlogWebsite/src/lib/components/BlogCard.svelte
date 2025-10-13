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

<div class="rounded-lg border border-border bg-card p-4 sm:p-5 lg:p-6">
  <div class="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
    <div class="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
      <Avatar
        class="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0"
        src={blog.author?.profile?.avatar || undefined}
        fallback={blog.author?.name
          ? getInitials(blog.author.name, blog.author.name)
          : blog.author?.email?.charAt(0).toUpperCase() || "U"}
      />
      <div class="flex-1 min-w-0">
        <p class="text-xs font-medium text-foreground truncate">
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

    <div class="flex items-center gap-1 text-muted-foreground flex-shrink-0">
      <MessageCircle class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <span class="text-xs">{blog.comments ?? 0}</span>
    </div>
  </div>

  <h4 class="text-sm sm:text-base font-semibold text-foreground mb-2 sm:mb-3 line-clamp-2">
    {blog.title}
  </h4>

  {#if blog.tags && blog.tags.length > 0}
    <div class="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
      {#each blog.tags.slice(0, 3) as tag}
        <Badge variant="secondary" class="text-xs px-1.5 sm:px-2 py-0.5">
          {tag}
        </Badge>
      {/each}
      {#if blog.tags.length > 3}
        <Badge variant="outline" class="text-xs px-1.5 sm:px-2 py-0.5">
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
        className="flex-1 text-xs sm:text-sm group/btn relative overflow-hidden h-8 sm:h-9"
      >
        <span
          class="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"
        ></span>
        <span class="relative flex items-center justify-center gap-1.5 sm:gap-2">
          <span class="hidden sm:inline">Continue Reading</span>
          <span class="sm:hidden">Read</span>
          <ArrowRight
            class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-200"
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
      className="w-full text-xs sm:text-sm group/btn relative overflow-hidden h-8 sm:h-9"
    >
      <span
        class="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"
      ></span>
      <span class="relative flex items-center justify-center gap-1.5 sm:gap-2">
        <span class="hidden sm:inline">Continue Reading</span>
        <span class="sm:hidden">Read More</span>
        <ArrowRight
          class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-200"
        />
      </span>
    </Button>
  {/if}
</div>
