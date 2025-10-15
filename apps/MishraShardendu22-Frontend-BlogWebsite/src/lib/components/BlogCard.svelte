<script lang="ts">
  import Badge from "./ui/badge.svelte";
  import Avatar from "./ui/avatar.svelte";
  import Button from "./ui/button.svelte";
  import { MessageCircle, Calendar, ArrowRight, Clock } from "lucide-svelte";
  import { marked } from "marked";
  import DOMPurify from "dompurify";
  import type { Blog as ApiBlog } from "../api";

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
  class="group relative rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5 lg:p-6 
         transition-all duration-300 overflow-hidden"
>
  <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  
  <div class="relative z-10">
    {#if blog.image}
        <div class="mb-4 rounded-lg overflow-hidden aspect-video bg-muted">
        <img 
          src={blog.image} 
          alt={blog.title} 
          class="w-full h-full object-cover" 
        />
      </div>
    {/if}

    <div class="flex items-center justify-between gap-3 mb-4">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <Avatar
          class="w-8 h-8 flex-shrink-0 ring-2 ring-primary/10 transition-all duration-300"
          src={blog.author?.profileImage || blog.author?.image || blog.author?.avatar || blog.author?.profile?.avatar || undefined}
          fallback={blog.author?.name
            ? getInitials(blog.author.name, blog.author.name)
            : blog.author?.email?.charAt(0).toUpperCase() || "U"}
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {blog.author?.name || blog.author?.email || "Unknown Author"}
          </p>
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <span class="flex items-center gap-1">
              <Calendar class="w-3 h-3" />
              {formatDate(blog.createdAt)}
            </span>
            {#if readingTime > 0}
              <span class="flex items-center gap-1">
                <Clock class="w-3 h-3" />
                {readingTime} min read
              </span>
            {/if}
          </div>
        </div>
      </div>

      <div class="flex items-center gap-1.5 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors">
        <MessageCircle class="w-4 h-4" />
        <span class="text-sm font-medium">{blog.comments ?? 0}</span>
      </div>
    </div>

    <h3 class="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
      {blog.title}
    </h3>

    {#if excerpt}
      <p class="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
        {excerpt}
      </p>
    {/if}

    {#if blog.tags && blog.tags.length > 0}
      <div class="flex flex-wrap gap-2 mb-4">
        {#each blog.tags.slice(0, 3) as tag}
          <Badge 
            variant="secondary" 
            class="text-xs px-2.5 py-1 font-medium hover:bg-primary/20 transition-colors"
          >
            {tag}
          </Badge>
        {/each}
        {#if blog.tags.length > 3}
          <Badge variant="outline" class="text-xs px-2.5 py-1 font-medium">
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
          className="flex-1 text-sm group/btn relative overflow-hidden h-10 font-semibold border-2 
                     hover:border-primary hover:bg-primary hover:text-primary-foreground 
                     shadow-sm hover:shadow-md transition-all duration-300"
        >
          <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                       -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
          <span class="relative flex items-center justify-center gap-2">
            Read Article
            <ArrowRight class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </span>
        </Button>
        {@render customActions?.()}
      </div>
    {:else}
      <Button
        variant="outline"
        size="sm"
        onclick={() => onReadMore?.(blog.id.toString())}
        className="w-full text-sm group/btn relative overflow-hidden h-10 font-semibold border-2 
                   hover:border-primary hover:bg-primary hover:text-primary-foreground 
                   shadow-sm hover:shadow-md transition-all duration-300"
      >
        <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                     -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
        <span class="relative flex items-center justify-center gap-2">
          Read Article
          <ArrowRight class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </span>
      </Button>
    {/if}
  </div>
</article>