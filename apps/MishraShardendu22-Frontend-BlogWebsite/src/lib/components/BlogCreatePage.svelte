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

  let title = $state("");
  let content = $state("");
  let tags = $state<string[]>([]);
  let newTag = $state("");
  let isSubmitting = $state(false);
  
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

  const validateForm = (): boolean => {
    let isValid = true;
    
    titleError = "";
    contentError = "";

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
      const response = await blogApi.createBlog({
        title: title.trim(),
        content: content.trim(),
        tags: tags.length > 0 ? tags : undefined,
        published: true,
      });

      if (response.success) {
        toast.success("Blog post created successfully!");
        setTimeout(() => {
          window.location.href = "/blog/read";
        }, 1000);
      }
    } catch (err: any) {
      console.error("Failed to create blog:", err);
      toast.error(err.message || "Failed to create blog post");
      isSubmitting = false;
    }
  };
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
            class="flex-1 {tagError ? 'border-destructive' : ''}"
          />
          <Button className="" type="button" onclick={handleAddTag} size="sm" variant="secondary">
            <Plus class="w-4 h-4" />
          </Button>
        </div>

        {#if tagError}
          <p class="text-xs text-destructive">{tagError}</p>
        {/if}

        {#if tags.length > 0}
          <div class="flex flex-wrap gap-2 mt-3">
            {#each tags as tag}
              <Badge variant="secondary" class="flex items-center gap-1 px-3 py-1.5">
                {tag}
                <button
                  type="button"
                  onclick={() => handleRemoveTag(tag)}
                  class="ml-1 hover:text-destructive transition-colors"
                >
                  <X class="w-3 h-3" />
                </button>
              </Badge>
            {/each}
          </div>
        {/if}
        <p class="text-sm text-muted-foreground">
          Add tags to categorize your post (max 10 tags, alphanumeric & hyphens only)
        </p>
      </div>
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
  <Button className="" type="button" variant="outline" onclick={() => (window.location.href = "/blog/read")}>Cancel</Button>
  <Button className="" type="submit" disabled={isSubmitting} onclick={() => {}}>
        <Save class="w-4 h-4 mr-2" />
        {isSubmitting ? "Creating..." : "Create Post"}
      </Button>
    </div>
  </form>
</div>
