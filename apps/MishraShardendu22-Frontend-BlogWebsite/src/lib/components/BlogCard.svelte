<script lang="ts">
  import Badge from "./ui/badge.svelte";
  import Avatar from "./ui/avatar.svelte";
  import Button from "./ui/button.svelte";
  import { MessageCircle, Calendar, ArrowRight, Clock } from "lucide-svelte";
  import { marked } from "marked";
  import DOMPurify from "dompurify";
  import type { Blog as ApiBlog } from "../api";
  import { resolveImageUrl } from "../utils/image";

  type Blog = ApiBlog;

  let {
    blog,
    onReadMore,
    customActions,
    maxExcerptLength = 150,
  }: {
    blog: Blog;
    onReadMore?: (blogId: string) => void;
    customActions?: any;
    maxExcerptLength?: number;
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

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  const parseMarkdownExcerpt = (markdown: string): string => {
    if (!markdown) return "";
    
    const html = marked.parse(markdown, { async: false }) as string;
    const sanitized = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
    const cleaned = sanitized.replace(/\s+/g, " ").trim();
    
    if (cleaned.length <= maxExcerptLength) return cleaned;
    return cleaned.substring(0, maxExcerptLength).trim() + "...";
  };

  const excerpt = $derived(
    blog.content ? parseMarkdownExcerpt(blog.content) : ""
  );
  
  const readingTime = $derived(
    blog.content ? getReadingTime(blog.content) : 0
  );
</script>

<article
  class="group relative rounded-xl border border-border overflow-hidden h-[420px] sm:h-[450px] lg:h-[520px] transition-all duration-300 hover:border-border/80"
>
  {#if blog.image}
    <div class="absolute inset-0">
      <img
        src={resolveImageUrl(blog.image)}
        alt={blog.title}
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div class="absolute inset-0 backdrop-blur-xl bg-black/60"></div>
    </div>
  {:else}
    <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-background"></div>
  {/if}

  <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  
  <div class="relative z-10 p-3 sm:p-4 lg:p-5 h-full flex flex-col">
    <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs mb-3 sm:mb-4">
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <Avatar
          class="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 ring-2 ring-primary/10"
          src={resolveImageUrl(blog.author?.profileImage || blog.author?.image || blog.author?.avatar || blog.author?.profile?.avatar || undefined)}
          fallback={blog.author?.name ? getInitials(blog.author.name, blog.author.name) : blog.author?.email?.charAt(0).toUpperCase() || "U"}
        />
        <div class="min-w-0 flex-1">
          <div class="text-xs sm:text-sm font-semibold text-white truncate">{blog.author?.name || blog.author?.email || "Unknown"}</div>
          <div class="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-white/80">
            <span class="truncate">{formatDate(blog.createdAt)}</span>
            {#if readingTime > 0}
              <span class="hidden xs:inline">•</span>
              <span class="hidden xs:inline">{readingTime} min</span>
            {/if}
          </div>
        </div>
      </div>

      {#if blog.tags && blog.tags.length > 0}
        <div class="hidden sm:flex items-center gap-1.5 flex-shrink-0 flex-wrap">
          {#each blog.tags.slice(0, 2) as tag}
            <Badge variant="secondary" class="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-white/20 text-white border-white/30">{tag}</Badge>
          {/each}
          {#if blog.tags.length > 2}
            <Badge variant="outline" class="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-white/10 text-white border-white/30">+{blog.tags.length - 2}</Badge>
          {/if}
        </div>
      {/if}

      <div class="hidden sm:flex sm:ml-auto items-center gap-2 sm:gap-3 flex-shrink-0">
        <div class="flex items-center gap-1 text-xs sm:text-sm text-white/90">
          <MessageCircle class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span class="font-medium">{blog.comments ?? 0}</span>
        </div>

        {#if customActions}
          {@render customActions?.()}
        {/if}

        <Button
          variant="outline"
          size="sm"
          onclick={() => onReadMore?.(blog.id.toString())}
          className="h-8 sm:h-9 px-2.5 sm:px-3 bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs sm:text-sm"
        >
          Read
          <ArrowRight class="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
        </Button>
      </div>
    </div>

    <h3 class="text-sm sm:text-base lg:text-lg font-bold text-white mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary-200 transition-colors leading-tight">
      {blog.title}
    </h3>

    {#if excerpt}
      <p class="hidden md:block text-xs sm:text-sm text-white/80 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed flex-1">
        {excerpt}
      </p>
    {/if}

    <!-- Mobile tags and actions -->
    <div class="flex sm:hidden flex-col gap-2 mt-auto pt-2">
      {#if blog.tags && blog.tags.length > 0}
        <div class="flex items-center gap-1.5 flex-wrap">
          {#each blog.tags.slice(0, 3) as tag}
            <Badge variant="secondary" class="text-[10px] px-1.5 py-0.5 bg-white/20 text-white border-white/30">{tag}</Badge>
          {/each}
          {#if blog.tags.length > 3}
            <Badge variant="outline" class="text-[10px] px-1.5 py-0.5 bg-white/10 text-white border-white/30">+{blog.tags.length - 3}</Badge>
          {/if}
        </div>
      {/if}

      <div class="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
        <div class="flex items-center gap-1 text-xs text-white/90">
          <MessageCircle class="w-3.5 h-3.5" />
          <span class="font-medium">{blog.comments ?? 0}</span>
        </div>

        <div class="flex items-center gap-2">
          {#if customActions}
            {@render customActions?.()}
          {/if}

          <Button
            variant="outline"
            size="sm"
            onclick={() => onReadMore?.(blog.id.toString())}
            className="h-8 px-3 bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs"
          >
            Read
            <ArrowRight class="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</article>
