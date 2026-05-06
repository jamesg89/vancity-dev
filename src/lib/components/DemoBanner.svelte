<script lang="ts">
  import { goto } from '$app/navigation';
  import type { DemoConfig, DemoVariant } from '$lib/demos/types';

  let { demo, variant }: { demo: DemoConfig; variant: DemoVariant } = $props();

  function switchVariant(key: string) {
    goto(`?v=${key}`, { replaceState: true, noScroll: true });
  }
</script>

<div class="demo-banner">
  <div class="demo-banner-inner">
    <span class="demo-label">
      <span class="preview-dot"></span>
      Preview · <strong>{demo.clientName}</strong>
    </span>

    <div class="variant-switcher">
      {#each demo.variants as v (v.key)}
        <button
          class="variant-btn"
          data-active={v.key === variant.key ? 'true' : 'false'}
          onclick={() => switchVariant(v.key)}
          title={v.label}
        >
          {v.key.toUpperCase()}
        </button>
      {/each}
    </div>

    <a href="https://vancity.dev/#contact" class="demo-cta" target="_blank" rel="noopener noreferrer">
      by Vancity Dev →
    </a>
  </div>
</div>

<style>
  .demo-banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 44px;
    z-index: 200;
    background: #1a2a26;
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
  }

  .demo-banner-inner {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .demo-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.06em;
    color: rgba(255, 255, 255, 0.65);
    white-space: nowrap;
  }

  .demo-label strong {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }

  .preview-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #69c97a;
    box-shadow: 0 0 0 3px rgba(105, 201, 122, 0.3);
    animation: pulse 2.4s ease-in-out infinite;
    flex: 0 0 auto;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .variant-switcher {
    display: flex;
    gap: 4px;
  }

  .variant-btn {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: transparent;
    color: rgba(255, 255, 255, 0.5);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    display: grid;
    place-items: center;
  }

  .variant-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.85);
  }

  .variant-btn[data-active='true'] {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.4);
  }

  .demo-cta {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.45);
    white-space: nowrap;
    transition: color 0.15s;
  }

  .demo-cta:hover {
    color: rgba(255, 255, 255, 0.85);
  }

  @media (max-width: 520px) {
    .demo-cta { display: none; }
  }
</style>
