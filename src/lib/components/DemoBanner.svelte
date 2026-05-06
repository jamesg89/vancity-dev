<script lang="ts">
  import { goto } from '$app/navigation';
  import type { DemoConfig, DemoVariant } from '$lib/demos/types';

  let { demo, variant }: { demo: DemoConfig; variant: DemoVariant } = $props();

  function switchVariant(key: string) {
    goto(`?v=${key}`, { replaceState: true, noScroll: true });
  }

  function shortLabel(label: string): string {
    return label.split(' — ')[1] ?? label;
  }
</script>

<div class="demo-banner">
  <div class="demo-banner-inner">
    <span class="demo-label">
      <span class="preview-dot"></span>
      Preview · <strong>{demo.clientName}</strong>
    </span>

    <div class="variant-switcher">
      <span class="style-prefix">STYLE</span>
      {#each demo.variants as v (v.key)}
        <button
          class="variant-btn"
          data-active={v.key === variant.key ? 'true' : 'false'}
          onclick={() => switchVariant(v.key)}
          title={v.label}
        >
          <span class="variant-letter">{v.key.toUpperCase()}</span>
          <span class="variant-name">{shortLabel(v.label)}</span>
        </button>
      {/each}
    </div>

    <a href="https://vancity.dev/#pricing" class="demo-cta" target="_blank" rel="noopener noreferrer">
      Get your website →
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
    align-items: center;
    gap: 4px;
  }

  .style-prefix {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.3);
    margin-right: 4px;
    white-space: nowrap;
  }

  .variant-btn {
    height: 28px;
    padding: 0 10px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: transparent;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }

  .variant-btn:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .variant-letter {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.35);
    transition: color 0.15s;
  }

  .variant-name {
    font-size: 10px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.45);
    letter-spacing: 0.04em;
    transition: color 0.15s;
  }

  .variant-btn[data-active='true'] {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.35);
  }

  .variant-btn[data-active='true'] .variant-letter {
    color: #69c97a;
  }

  .variant-btn[data-active='true'] .variant-name {
    color: rgba(255, 255, 255, 0.9);
  }

  .demo-cta {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: #0d1f18;
    background: #69c97a;
    padding: 0 12px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    white-space: nowrap;
    transition: filter 0.15s;
    text-decoration: none;
  }

  .demo-cta:hover {
    filter: brightness(1.08);
  }

  @media (max-width: 720px) {
    .style-prefix { display: none; }
    .variant-name { display: none; }
    .variant-btn { width: 28px; padding: 0; justify-content: center; }
  }

  @media (max-width: 520px) {
    .demo-cta { display: none; }
  }
</style>
