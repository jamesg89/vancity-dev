<script lang="ts">
  const menuItems = [
    { name: 'Single Origin Pour-Over', desc: 'Ethiopian Yirgacheffe · bright, floral', price: '$7' },
    { name: 'Reserve Espresso', desc: 'Double shot · rotating single origin', price: '$6' },
    { name: 'Honey Oat Latte', desc: 'House oat milk · local wildflower honey', price: '$8' },
    { name: 'Cold Brew', desc: 'Salted caramel · 18hr steep', price: '$9' },
    { name: 'Cortado', desc: 'Equal parts espresso and steamed milk', price: '$6' },
    { name: 'Matcha Latte', desc: 'Ceremonial grade · oat or almond', price: '$7' },
  ];
</script>

<div class="demo-page">

  <nav class="demo-nav">
    <span class="demo-nav-brand">Water St. Café</span>
    <ul class="demo-nav-links">
      <li><a href="#menu">Menu</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#visit">Visit</a></li>
    </ul>
    <a href="#visit" class="demo-nav-cta">Book a Table</a>
  </nav>

  <section class="demo-hero">
    <p class="demo-eyebrow">Est. 2017 · Gastown, Vancouver</p>
    <h1>Water St.<br /><em>Café</em></h1>
    <p class="demo-sub">
      Artisan coffee, slow mornings.<br />
      Roasted on-site. Poured with care.
    </p>
    <div class="demo-ctas">
      <a href="#menu" class="btn">View Menu →</a>
      <a href="#visit" class="btn ghost">Book a Table</a>
    </div>
  </section>

  <section id="about" class="demo-about">
    <div class="demo-about-inner">
      <div class="demo-about-photo" aria-hidden="true">
        <div class="photo-placeholder">[ photo · 4:5 ]</div>
      </div>
      <div class="demo-about-text">
        <p class="demo-sec-num">— 01</p>
        <h2>Roasted<br /><em>on-site.</em></h2>
        <p>
          We source directly from small farms across Ethiopia, Colombia, and Guatemala.
          Every cup is prepared to order — no shortcuts, no automation, no rush.
        </p>
        <p>
          310 Water Street has been our home since 2017. Come in, slow down, and stay a while.
        </p>
      </div>
    </div>
  </section>

  <section id="menu" class="demo-menu">
    <div class="container">
      <div class="demo-sec-head">
        <p class="demo-sec-num">— 02</p>
        <h2>Signature <em>drinks</em>.</h2>
      </div>
      <div class="menu-list">
        {#each menuItems as item, i (item.name)}
          <div class="menu-row">
            <span class="menu-num">{String(i + 1).padStart(2, '0')}</span>
            <span class="menu-name">{item.name}</span>
            <span class="menu-desc">{item.desc}</span>
            <span class="menu-price">{item.price}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section id="visit" class="demo-visit">
    <div class="container">
      <div class="demo-sec-head">
        <p class="demo-sec-num">— 03</p>
        <h2>Find <em>us</em>.</h2>
      </div>
      <div class="visit-grid">
        <div class="visit-col">
          <p class="visit-label">Address</p>
          <p>310 Water Street</p>
          <p>Gastown, Vancouver</p>
          <p>BC V6B 1B6</p>
        </div>
        <div class="visit-col">
          <p class="visit-label">Hours</p>
          <p>Mon – Fri &nbsp;&nbsp; 7am – 6pm</p>
          <p>Saturday &nbsp;&nbsp;&nbsp; 8am – 5pm</p>
          <p>Sunday &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 9am – 4pm</p>
        </div>
        <div class="visit-col">
          <p class="visit-label">Contact</p>
          <p>hello@waterstreetcafe.ca</p>
          <p>+1 (604) 555-0177</p>
        </div>
      </div>
    </div>
  </section>

  <footer class="demo-footer">
    <span>© 2026 Water St. Café</span>
    <span>310 Water St · Gastown, Vancouver</span>
  </footer>

</div>

<style>
  .demo-page {
    font-family: var(--sans);
    color: var(--ink);
    background: var(--bg);
  }

  /* Nav */
  .demo-nav {
    position: sticky;
    top: 44px;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 36px;
    background: var(--bg);
    border-bottom: 0.5px solid var(--line);
  }

  .demo-nav-brand {
    font-family: var(--serif);
    font-style: italic;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: -0.01em;
  }

  .demo-nav-links {
    display: flex;
    gap: 28px;
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 13.5px;
    color: var(--ink-soft);
  }

  .demo-nav-links a { color: inherit; transition: color 0.15s; }
  .demo-nav-links a:hover { color: var(--ink); }

  .demo-nav-cta {
    font-size: 13px;
    font-weight: 500;
    padding: 8px 18px;
    border-radius: 999px;
    background: var(--accent);
    color: var(--bg);
    transition: background 0.15s;
  }

  .demo-nav-cta:hover { background: var(--ink); }

  /* Hero */
  .demo-hero {
    padding: 120px 36px 100px;
    max-width: 760px;
  }

  .demo-eyebrow {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-soft);
    margin-bottom: 28px;
  }

  .demo-hero h1 {
    font-family: var(--serif);
    font-weight: 300;
    font-size: clamp(64px, 10vw, 140px);
    letter-spacing: -0.04em;
    line-height: 0.92;
    margin: 0 0 36px;
  }

  .demo-hero h1 em {
    font-style: italic;
    color: var(--accent);
  }

  .demo-sub {
    font-size: 17px;
    line-height: 1.6;
    color: var(--ink-soft);
    margin-bottom: 48px;
    max-width: 420px;
  }

  .demo-ctas {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
  }

  /* About */
  .demo-about {
    background: var(--paper);
    padding: 100px 36px;
  }

  .demo-about-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .demo-about-photo {
    aspect-ratio: 4/5;
    background: var(--line);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .photo-placeholder {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-soft);
    opacity: 0.4;
  }

  .demo-sec-num {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--ink-soft);
    margin-bottom: 20px;
  }

  .demo-about-text h2 {
    font-family: var(--serif);
    font-weight: 300;
    font-size: clamp(40px, 5vw, 72px);
    letter-spacing: -0.03em;
    line-height: 1;
    margin: 0 0 28px;
  }

  .demo-about-text h2 em {
    font-style: italic;
    color: var(--accent);
  }

  .demo-about-text p {
    font-size: 15.5px;
    line-height: 1.7;
    color: var(--ink-soft);
    margin-bottom: 16px;
    max-width: 440px;
  }

  /* Menu */
  .demo-menu { padding: 100px 36px; }

  .demo-sec-head { margin-bottom: 48px; }

  .demo-sec-head h2 {
    font-family: var(--serif);
    font-weight: 300;
    font-size: clamp(36px, 4vw, 64px);
    letter-spacing: -0.025em;
    line-height: 1;
    margin: 0;
  }

  .demo-sec-head h2 em {
    font-style: italic;
    color: var(--accent);
  }

  .menu-list { border-top: 0.5px solid var(--line); }

  .menu-row {
    display: grid;
    grid-template-columns: 36px 1fr 1fr 60px;
    gap: 20px;
    align-items: baseline;
    padding: 22px 0;
    border-bottom: 0.5px solid var(--line);
    transition: background 0.15s, padding 0.15s;
  }

  .menu-row:hover {
    background: var(--paper);
    padding-left: 12px;
    padding-right: 12px;
  }

  .menu-num {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-soft);
    opacity: 0.5;
  }

  .menu-name {
    font-family: var(--serif);
    font-size: clamp(18px, 2vw, 26px);
    font-weight: 400;
    letter-spacing: -0.01em;
  }

  .menu-desc {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--ink-soft);
  }

  .menu-price {
    font-family: var(--mono);
    font-size: 13px;
    text-align: right;
    color: var(--warm);
  }

  /* Visit */
  .demo-visit {
    background: var(--paper);
    padding: 100px 36px;
  }

  .visit-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
  }

  .visit-label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-soft);
    opacity: 0.5;
    margin-bottom: 14px;
  }

  .visit-col p {
    font-size: 15px;
    line-height: 1.8;
    color: var(--ink-soft);
  }

  /* Footer */
  .demo-footer {
    background: var(--ink);
    color: var(--bg);
    padding: 28px 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--mono);
    font-size: 11px;
    opacity: 0.9;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .demo-about-inner { grid-template-columns: 1fr; gap: 40px; }
    .menu-row { grid-template-columns: 28px 1fr 50px; }
    .menu-desc { display: none; }
    .visit-grid { grid-template-columns: 1fr; }
    .demo-nav-links { display: none; }
    .demo-hero { padding: 80px 22px 60px; }
    .demo-footer { flex-direction: column; gap: 8px; align-items: flex-start; }
  }
</style>
