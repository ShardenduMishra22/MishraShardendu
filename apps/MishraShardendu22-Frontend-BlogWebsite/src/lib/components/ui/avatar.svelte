<script lang="ts">
  import { cn } from "../../utils";

  let {
    class: className,
    src,
    alt = "",
    fallback,
    ...restProps
  }: {
    class?: string;
    src?: string;
    alt?: string;
    fallback?: string;
    [key: string]: any;
  } = $props();

  let imageLoaded = $state(false);
  let imageError = $state(false);
</script>

<div
  class={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
  {...restProps}
>
  {#if src && !imageError}
    <img
      {src}
      {alt}
      class={cn("aspect-square h-full w-full object-cover", imageLoaded ? "opacity-100" : "opacity-0")}
      onload={() => (imageLoaded = true)}
      onerror={() => (imageError = true)}
    />
  {/if}
  {#if !src || imageError || !imageLoaded}
    <div class="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm">
      {fallback || ""}
    </div>
  {/if}
</div>
