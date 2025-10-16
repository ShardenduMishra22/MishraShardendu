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
  class="group relative rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 lg:p-4 
         transition-all duration-300 overflow-hidden max-h-[520px]"
>
  <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  
  <div class="relative z-10">
    {#if blog.image}
      <div class="mb-3 rounded-lg overflow-hidden bg-muted h-44 w-full flex items-center justify-center">
        <img
          src={resolveImageUrl(blog.image)}
          alt={blog.title}
          class="w-full h-full object-contain" 
        />
      </div>
    {/if}

        <div class="flex items-center gap-3 text-xs text-muted-foreground">
      <div class="flex items-center gap-2 min-w-0">
        <Avatar
          class="w-7 h-7 flex-shrink-0 ring-2 ring-primary/10"
          src={resolveImageUrl(blog.author?.profileImage || blog.author?.image || blog.author?.avatar || blog.author?.profile?.avatar || undefined)}
          fallback={blog.author?.name ? getInitials(blog.author.name, blog.author.name) : blog.author?.email?.charAt(0).toUpperCase() || "U"}
        />
        <div class="min-w-0">
          <div class="text-sm font-semibold text-foreground truncate">{blog.author?.name || blog.author?.email || "Unknown"}</div>
          <div class="flex items-center gap-2 text-xs text-muted-foreground truncate">
            <span>{formatDate(blog.createdAt)}</span>
            {#if readingTime > 0}
              <span>• {readingTime} min</span>
            {/if}
          </div>
        </div>
      </div>

      {#if blog.tags && blog.tags.length > 0}
        <div class="flex items-center gap-2 ml-2">
          {#each blog.tags.slice(0,2) as tag}
            <Badge variant="secondary" class="text-xs px-2 py-0.5">{tag}</Badge>
          {/each}
          {#if blog.tags.length > 2}
            <Badge variant="outline" class="text-xs px-2 py-0.5">+{blog.tags.length - 2}</Badge>
          {/if}
        </div>
      {/if}

      <div class="ml-auto flex items-center gap-3">
        <div class="flex items-center gap-1 text-sm text-muted-foreground">
          <MessageCircle class="w-4 h-4" />
          <span class="font-medium">{blog.comments ?? 0}</span>
        </div>

        {#if customActions}
          {@render customActions?.()}
        {/if}

        <Button
          variant="outline"
          size="sm"
          onclick={() => onReadMore?.(blog.id.toString())}
          className="h-9 px-3"
        >
          Read
          <ArrowRight class="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>

    <h3 class="text-base lg:text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
      {blog.title}
    </h3>

    <!-- show excerpt on md+ screens only -->
    {#if excerpt}
      <p class="hidden md:block text-sm text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
        {excerpt}
      </p>
    {/if}
  </div>
</article>