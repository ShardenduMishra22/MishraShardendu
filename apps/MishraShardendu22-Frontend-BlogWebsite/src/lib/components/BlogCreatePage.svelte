<script lang="ts">
  import Button from "./ui/button.svelte";
  import Input from "./ui/input.svelte";
  import Label from "./ui/label.svelte";
  import Badge from "./ui/badge.svelte";
  import Textarea from "./ui/textarea.svelte";
  import { Save, X, Plus } from "lucide-svelte";
  import { cn } from "../utils";
  import { blogApi } from "../api";
  import { authStore } from "../auth";
  import { toast } from "../toast";
  import { validateBlogTitle, validateBlogContent, validateTag } from "../validation";

  let { blogId }: { blogId?: string | null } = $props();

  let title = $state("");
  let content = $state("");
  let tags = $state<string[]>([]);
  let newTag = $state("");
  let isSubmitting = $state(false);
  let image = $state("");
  let showImageInput = $state(false);
  let imageError = $state("");
  
  // Field-specific errors
  let titleError = $state("");
  let contentError = $state("");
  let tagError = $state("");

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    
    tagError = "";
    
    if (!trimmedTag) {
      return;
    }

    // Validate tag
    const validation = validateTag(trimmedTag);
    if (!validation.isValid) {
      tagError = validation.error || "Invalid tag";
      return;
    }

    if (tags.includes(trimmedTag)) {
      tagError = "Tag already added";
      return;
    }

    if (tags.length >= 10) {
      tagError = "Maximum 10 tags allowed";
      return;
    }

    tags = [...tags, trimmedTag];
    newTag = "";
  };

  const handleRemoveTag = (tagToRemove: string) => {
    tags = tags.filter((tag) => tag !== tagToRemove);
  };

  const loadExistingBlog = async (id: number) => {
    try {
      const response = await blogApi.getBlogById(id);
      if (response.success && response.data) {
        const b = response.data;
        title = b.title || "";
        content = b.content || "";
        tags = Array.isArray(b.tags) ? b.tags : [];
        image = b.image || "";
      }
    } catch (err) {
      console.error('Failed to load blog for editing', err);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    
  titleError = "";
  contentError = "";
  imageError = "";

    // Validate title
    const titleValidation = validateBlogTitle(title);
    if (!titleValidation.isValid) {
      titleError = titleValidation.error || "";
      isValid = false;
    }

    // Validate content
    const contentValidation = validateBlogContent(content);
    if (!contentValidation.isValid) {
      contentError = contentValidation.error || "";
      isValid = false;
    }

    // Validate Image (optional)
    if (image && image.trim()) {
      try {
        const parsed = new URL(image.trim());
        if (!parsed.protocol.startsWith("http")) {
          imageError = "Image URL must start with http or https";
          isValid = false;
        }
      } catch {
        imageError = "Invalid image URL format";
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    isSubmitting = true;

    try {
      const payload: any = {
        title: title.trim(),
        content: content.trim(),
        tags: tags.length > 0 ? tags : undefined,
        published: true,
      };

      if (image && image.trim()) payload.image = image.trim();

      if (blogId) {
        // Update existing blog
        const response = await blogApi.updateBlog(parseInt(blogId), payload);
        if (response.success) {
          toast.success("Blog post updated successfully!");
          setTimeout(() => (window.location.href = `/blog/read/${blogId}`), 800);
        }
      } else {
        const response = await blogApi.createBlog(payload);
        if (response.success) {
          toast.success("Blog post created successfully!");
          setTimeout(() => {
            window.location.href = "/blog/read";
          }, 1000);
        }
      }
    } catch (err: any) {
      console.error("Failed to create blog:", err);
      toast.error(err.message || "Failed to create blog post");
      isSubmitting = false;
    }
  };

  // Reactively load existing blog when blogId prop changes (prevents stale data)
  $effect(() => {
    if (!blogId) {
      // Clear form when not editing
      title = "";
      content = "";
      tags = [];
      image = "";
      return;
    }

    const id = parseInt(blogId as string);
    if (!isNaN(id)) {
      loadExistingBlog(id);
    }
  });
</script>

<div>
  <form onsubmit={handleSubmit} class="space-y-8">
    <!-- Title and Tags Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Title Section -->
      <div class="space-y-3">
        <Label for="title" class="text-base font-semibold">Title</Label>
        <Input
          id="title"
          placeholder="Enter your blog title..."
          bind:value={title}
          class="text-xl h-12 px-4 font-semibold border-2 focus:border-primary transition-colors {titleError ? 'border-destructive' : ''}"
          required
        />
        {#if titleError}
          <p class="text-xs text-destructive">{titleError}</p>
        {:else}
          <p class="text-sm text-muted-foreground">Give your blog post an engaging title (5-200 characters)</p>
        {/if}
      </div>

      <!-- Tags Section -->
      <div class="space-y-3">
        <Label for="tags" class="text-base font-semibold">Tags</Label>
        <div class="flex gap-2">
            <div class="flex items-center gap-2 w-full">
              <div class="flex-1 flex items-center gap-2 bg-card/40 border border-border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
                <Input
                  id="tags"
                  placeholder="Add a tag..."
                  bind:value={newTag}
                  onkeypress={(e: KeyboardEvent) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  class="w-full bg-transparent placeholder:text-muted-foreground border-0 focus:outline-none {tagError ? 'border-destructive' : ''}"
                />
                <button
                  type="button"
                  aria-label="Add tag"
                  onclick={handleAddTag}
                  class="w-9 h-9 inline-flex items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-transparent"
                >
                  <Plus class="w-4 h-4" />
                </button>
              </div>
            </div>
        </div>

        {#if tagError}
          <p class="text-xs text-destructive">{tagError}</p>
        {/if}

        {#if tags.length > 0}
          <div class="flex flex-wrap gap-2 mt-3">
            {#each tags as tag}
              <div class="inline-flex items-center gap-2 bg-muted/30 text-muted-foreground px-3 py-1.5 rounded-full text-sm font-medium shadow-sm border border-border">
                <span class="truncate max-w-[12rem]">{tag}</span>
                <button
                  type="button"
                  onclick={() => handleRemoveTag(tag)}
                  class="-mr-1 -ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-destructive/10 transition-colors"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X class="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            {/each}
          </div>
        {/if}
        <p class="text-sm text-muted-foreground">
          Add tags to categorize your post (max 10 tags, alphanumeric & hyphens only)
        </p>
      </div>
    </div>

    <!-- Image Section (optional) -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <Label for="image" class="text-base font-semibold">Post Image</Label>
        <Button type="button" variant="outline" className="text-sm" onclick={() => showImageInput = !showImageInput}>
          {showImageInput ? 'Hide Image' : 'Enter Image'}
        </Button>
      </div>
      {#if showImageInput}
        <Input
          id="image"
          placeholder="https://example.com/your-image.jpg"
          bind:value={image}
          class={imageError ? 'border-destructive' : ''}
        />
        {#if imageError}
          <p class="text-xs text-destructive">{imageError}</p>
        {:else}
          <p class="text-sm text-muted-foreground">Provide an image URL to display with the blog post (optional)</p>
        {/if}
      {:else}
        <p class="text-sm text-muted-foreground">You can optionally add an image for the post. Click "Enter Image" to add it.</p>
      {/if}
    </div>

    <!-- Content Section -->
    <div class="space-y-3">
      <Label for="content" class="text-base font-semibold">Content</Label>
      <Textarea
        id="content"
        placeholder="Write your blog content here... (Markdown supported)"
        bind:value={content}
        class="min-h-[400px] font-mono text-sm {contentError ? 'border-destructive' : ''}"
        required
      />
      {#if contentError}
        <p class="text-xs text-destructive">{contentError}</p>
      {:else}
        <p class="text-sm text-muted-foreground">
          Write your content using Markdown formatting (min 50 characters)
        </p>
      {/if}
      {#if content.length > 0}
        <p class="text-xs text-muted-foreground text-right">
          {content.length} characters
        </p>
      {/if}
    </div>

    <!-- Actions -->
    <div class="flex gap-3 justify-end">
  <Button className="" type="button" variant="outline" onclick={() => (window.location.href = blogId ? `/blog/read/${blogId}` : "/blog/read")}>
    Cancel
  </Button>
  <Button className="" type="submit" disabled={isSubmitting} onclick={() => {}}>
        <Save class="w-4 h-4 mr-2" />
        {isSubmitting ? (blogId ? "Updating..." : "Creating...") : (blogId ? "Update Post" : "Create Post")}
      </Button>
    </div>
  </form>
</div>
