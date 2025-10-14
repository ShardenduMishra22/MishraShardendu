<script lang="ts">
  import { cn } from "../../utils";

  let {
    class: className,
    type = "text",
    value = $bindable(),
    ...restProps
  }: {
    class?: string;
    type?: string;
    value?: string;
    [key: string]: any;
  } = $props();
</script>

<input
  {type}
  bind:value
  class={cn(
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    className
  )}
  {...restProps}
/>
