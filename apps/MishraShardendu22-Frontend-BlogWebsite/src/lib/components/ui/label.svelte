<script lang="ts">
  import { cn } from "../../utils";

  let {
    class: className,
    children,
    ...restProps
  }: {
    class?: string;
    children?: any;
    [key: string]: any;
  } = $props();
</script>

<label
  class={cn(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</label>
