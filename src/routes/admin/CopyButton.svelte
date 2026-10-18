<script lang="ts">
  let { text, label = 'Copy link' }: { text: string; label?: string } = $props();

  let status = $state<'idle' | 'copied' | 'manual'>('idle');
  let manualInput = $state<HTMLInputElement>();

  async function copy() {
    try {
      // navigator.clipboard only exists in a secure context (https or localhost), so over
      // plain HTTP on a LAN address it is undefined and this throws into the fallback.
      await navigator.clipboard.writeText(text);
      status = 'copied';
    } catch {
      status = 'manual';
      // The input renders on the next tick; select it so Ctrl+C is all that is left.
      queueMicrotask(() => manualInput?.select());
    }
  }
</script>

<span class="copy">
  <button type="button" class="copy-btn" onclick={copy}>{label}</button>
  {#if status === 'copied'}
    <span class="note" role="status">Copied</span>
  {:else if status === 'manual'}
    <span class="note" role="status">Copying is not available here. Select the link and copy it.</span>
    <input
      class="manual"
      readonly
      value={text}
      aria-label="Link to copy"
      bind:this={manualInput}
      onfocus={(e) => e.currentTarget.select()}
    />
  {/if}
</span>

<style>
  .copy {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
  .copy-btn {
    font: inherit;
    font-size: 0.85rem;
    padding: 0.3rem 0.75rem;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: transparent;
    color: var(--ink);
    cursor: pointer;
  }
  .copy-btn:hover {
    border-color: var(--accent);
  }
  .note {
    font-size: 0.85rem;
    color: var(--ink-soft);
  }
  .manual {
    flex-basis: 100%;
    font-family: var(--mono);
    font-size: 0.85rem;
    padding: 0.4rem 0.6rem;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--paper);
    color: var(--ink);
  }
</style>
