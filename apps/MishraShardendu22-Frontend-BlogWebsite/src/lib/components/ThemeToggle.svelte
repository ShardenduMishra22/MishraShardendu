<script lang="ts">
  import { Moon, Sun } from "lucide-svelte";
  import { themeStore } from "../theme";
  import { onMount } from "svelte";

  let theme = $state<"light" | "dark">("light");
  let mounted = $state(false);

  onMount(() => {
    // Initialize theme
    themeStore.init();
    mounted = true;
  });

  // Subscribe to theme changes
  themeStore.subscribe((t) => {
    theme = t;
  });

  function toggleTheme() {
    themeStore.toggle();
  }
</script>

{#if mounted}
  <button
    aria-label="Toggle Dark Mode"
    class="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-card shadow-lg border border-border hover:bg-accent hover:border-accent-foreground transition-all duration-200 hover:scale-110"
    onclick={toggleTheme}
  >
    {#if theme === "dark"}
      <Sun class="w-5 h-5 text-yellow-400 transition-transform duration-300" />
    {:else}
      <Moon class="w-5 h-5 text-foreground transition-transform duration-300" />
    {/if}
  </button>
{/if}

<style>
  button {
    box-shadow: 0 4px 6px -1px var(--shadow), 0 2px 4px -1px var(--shadow);
  }

  button:hover {
    box-shadow: 0 10px 15px -3px var(--shadow-strong),
      0 4px 6px -2px var(--shadow);
  }

  button:active {
    transform: scale(0.95);
  }
</style>
