<script lang="ts">
  let { data } = $props();

  let bookingOpen = $state(false);
  let bookingStep = $state(0);
  let bookingService: string | null = $state(null);
  let bookingDate: Date | null = $state(null);
  let bookingTime: string | null = $state(null);
  let bookingDetails = $state({ first: '', last: '', email: '', phone: '' });
  let bookingConfirmed = $state(false);

  const SERVICES = [
    { id: 'tax', name: 'Personal Tax Planning', desc: 'T1 returns, optimization, cross-border.', duration: '45 min' },
    { id: 'corp', name: 'Corporate & Small Business', desc: 'T2 filings, year-end, advisory.', duration: '60 min' },
    { id: 'estate', name: 'Estate & Trust', desc: 'Succession, executor support, wealth planning.', duration: '60 min' },
    { id: 'general', name: 'General Consultation', desc: 'Not sure where to start? Begin here.', duration: '30 min' },
  ];

  function openBooking() { bookingOpen = true; }
  function closeBooking() {
    bookingOpen = false;
    setTimeout(() => {
      bookingStep = 0; bookingService = null; bookingDate = null;
      bookingTime = null; bookingDetails = { first: '', last: '', email: '', phone: '' };
      bookingConfirmed = false;
    }, 300);
  }

  const isValid = $derived(
    bookingStep === 0 ? !!bookingService :
    bookingStep === 1 ? !!bookingDate && !!bookingTime :
    bookingStep === 2 ? !!(bookingDetails.first && bookingDetails.last && bookingDetails.email.includes('@')) :
    false
  );

  function bookingNext() {
    if (bookingStep < 2 && isValid) bookingStep++;
    else if (bookingStep === 2 && isValid) bookingConfirmed = true;
  }
</script>

<svelte:head>
  <title>Alex Jo, CPA — Chartered Professional Accountant</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500;1,600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
</svelte:head>

<div class="aj-root" class:ed-root={data.variant?.key === 'a'} class:ar-root={data.variant?.key === 'b'} class:pr-root={data.variant?.key === 'c'}>

  {#if data.variant?.key === 'a'}
    <!-- ===================================================== -->
    <!-- DIRECTION A — EDITORIAL                                -->
    <!-- ===================================================== -->

    <nav class="aj-nav">
      <div class="aj-logo"><span class="mark">A</span><span>Alex Jo, <em>cpa</em></span></div>
      <div class="aj-nav-links">
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#approach">Approach</a>
        <a href="#contact">Contact</a>
      </div>
      <button class="aj-nav-cta" onclick={openBooking}>Book consultation</button>
    </nav>

    <section class="ed-hero">
      <div class="ed-hero-meta">
        <div class="aj-eyebrow">Est. 2008 · Vancouver, BC</div>
        <div class="ed-hero-meta-right">
          <span>Chartered Professional Accountant</span>
          <span>·</span>
          <span>CPA, CA</span>
        </div>
      </div>
      <h1 class="ed-hero-h">
        A quiet practice for<br />
        <em>considered</em> financial<br />
        stewardship.
      </h1>
      <div class="ed-hero-foot">
        <p class="ed-hero-lede">
          For nearly two decades, Alex Jo has counselled families, founders, and professionals across British Columbia on the matters of tax, succession, and stewardship that quietly compound over a lifetime.
        </p>
        <div class="ed-hero-actions">
          <button class="aj-btn primary" onclick={openBooking}>Request a consultation <span class="aj-arrow">→</span></button>
          <a class="aj-btn ghost" href="#services">Explore the practice</a>
        </div>
      </div>
    </section>

    <section class="ed-strip">
      <div class="ed-strip-inner">
        <span>CPA British Columbia</span>
        <span class="dot">·</span>
        <span>Chartered Professional Accountants of Canada</span>
        <span class="dot">·</span>
        <span>UBC Sauder, B.Comm</span>
        <span class="dot">·</span>
        <span>Est. 2008</span>
      </div>
    </section>

    <section class="ed-intro" id="about">
      <div class="ed-intro-grid">
        <div class="ed-intro-left">
          <div class="aj-eyebrow ink">A note from the principal</div>
          <p class="ed-pull">
            "Good accounting is, in the end, a discipline of attention. The numbers are the easy part — what matters is understanding the family or the business behind them."
          </p>
          <p class="ed-body">
            I founded this practice on the conviction that financial counsel is, at its best, a long relationship rather than a transaction. My clients tend to stay for many years, and many introduce the next generation. We work deliberately, in small numbers, and we answer the phone.
          </p>
          <div class="ed-sig">
            <div class="ed-sig-mark">Alex Jo</div>
            <div class="ed-sig-meta">Principal · CPA, CA</div>
          </div>
        </div>
        <div class="ed-intro-right">
          <div class="aj-photo ed-portrait" aria-hidden="true">
            <span class="aj-photo-tag">portrait · alex jo</span>
          </div>
          <div class="ed-portrait-cap">
            <span>Photographed at the firm's offices,<br />Howe Street, Vancouver.</span>
            <span class="ed-portrait-num">01</span>
          </div>
        </div>
      </div>
    </section>

    <section class="ed-services" id="services">
      <header class="ed-services-head">
        <div class="aj-eyebrow">The practice</div>
        <h2 class="ed-h2">Five disciplines,<br/>practised <em>quietly</em>.</h2>
      </header>
      <div class="ed-svc-list">
        {#each [
          { n: '01', t: 'Personal Tax & Planning', d: 'T1 returns, multi-jurisdictional filings, and long-horizon tax architecture for individuals and families.' },
          { n: '02', t: 'Owner-Managed Business', d: 'Year-end, T2 corporate filings, compensation planning, and counsel for closely held companies.' },
          { n: '03', t: 'Estate, Trust & Succession', d: 'Estate freezes, executor support, family-trust administration, and intergenerational structures.' },
          { n: '04', t: 'Assurance & Review', d: 'Audit, review, and compilation engagements for private companies and not-for-profits.' },
          { n: '05', t: 'Advisory & Forensic', d: 'Litigation support, business valuation, and considered counsel for sensitive matters.' },
        ] as s (s.n)}
          <article class="ed-svc">
            <div class="ed-svc-n">{s.n}</div>
            <h3 class="ed-svc-t">{s.t}</h3>
            <p class="ed-svc-d">{s.d}</p>
            <a class="ed-svc-link" href="#contact">Discuss this engagement <span class="aj-arrow">→</span></a>
          </article>
        {/each}
      </div>
    </section>

    <section class="ed-approach" id="approach">
      <div class="aj-photo dark ed-approach-img" aria-hidden="true">
        <span class="aj-photo-tag">vancouver harbour · dawn</span>
      </div>
      <div class="ed-approach-text">
        <div class="aj-eyebrow">The approach</div>
        <h2 class="ed-h2-light">A practice measured in <em>decades</em>, not deliverables.</h2>
        <div class="ed-approach-grid">
          <div><h4>Discretion</h4><p>Engagements are kept private by default. Files are encrypted at rest, in transit, and across our principal-only review chain.</p></div>
          <div><h4>Continuity</h4><p>You will not be passed between juniors. The principal retains every relationship from intake through filing and beyond.</p></div>
          <div><h4>Counsel</h4><p>We answer the question you asked, and the one you didn't. Plain language. No upselling. No surprises at year-end.</p></div>
          <div><h4>Pedigree</h4><p>CPA, CA — articled at a Big Four firm, with two decades counselling clients from sole proprietors to multi-generation family offices.</p></div>
        </div>
      </div>
    </section>

    <section class="ed-figures">
      <div class="ed-fig"><div class="ed-fig-n">18</div><div class="ed-fig-l">Years in practice</div></div>
      <div class="ed-fig"><div class="ed-fig-n">240+</div><div class="ed-fig-l">Active engagements</div></div>
      <div class="ed-fig"><div class="ed-fig-n">93%</div><div class="ed-fig-l">Client retention, decade-on</div></div>
      <div class="ed-fig"><div class="ed-fig-n">1:1</div><div class="ed-fig-l">Principal-led, always</div></div>
    </section>

    <section class="ed-cta" id="contact">
      <div class="ed-cta-inner">
        <div class="aj-eyebrow">Begin a conversation</div>
        <h2 class="ed-h2">If our practice suits the matter at hand,<br/>we would be glad to speak.</h2>
        <p class="ed-cta-sub">Initial consultations are complimentary, lasting thirty to sixty minutes, and held by appointment at our Howe Street offices or by video.</p>
        <div class="ed-cta-actions">
          <button class="aj-btn primary" onclick={openBooking}>Book a consultation <span class="aj-arrow">→</span></button>
          <a class="aj-btn ghost" href="mailto:office@alexjocpa.ca">office@alexjocpa.ca</a>
        </div>
      </div>
    </section>

    <footer class="aj-footer">
      <div class="grid">
        <div>
          <h3 class="firm-name">Alex Jo, CPA</h3>
          <p class="firm-blurb">A boutique chartered professional accountancy serving British Columbia families, founders, and professionals since 2008.</p>
        </div>
        <div>
          <h4>Practice</h4>
          <ul>
            <li><a href="/demo/alexjo">Personal Tax</a></li>
            <li><a href="/demo/alexjo">Owner-Managed</a></li>
            <li><a href="/demo/alexjo">Estate & Trust</a></li>
            <li><a href="/demo/alexjo">Assurance</a></li>
            <li><a href="/demo/alexjo">Advisory</a></li>
          </ul>
        </div>
        <div>
          <h4>Office</h4>
          <ul>
            <li>Suite 1820</li>
            <li>885 West Georgia St</li>
            <li>Vancouver, BC V6C 3E8</li>
            <li>+1 604 555 0182</li>
          </ul>
        </div>
        <div>
          <h4>Connect</h4>
          <ul>
            <li><a href="/demo/alexjo">LinkedIn</a></li>
            <li><a href="mailto:office@alexjocpa.ca">Email</a></li>
            <li><a href="/demo/alexjo">Secure portal</a></li>
          </ul>
        </div>
      </div>
      <div class="meta">
        <span>© 2026 Alex Jo, Chartered Professional Accountant Inc.</span>
        <span>Member · CPABC</span>
      </div>
    </footer>

  {:else if data.variant?.key === 'b'}
    <!-- ===================================================== -->
    <!-- DIRECTION B — ARCHITECTURAL                            -->
    <!-- ===================================================== -->

    <nav class="aj-nav ar-nav">
      <div class="aj-logo">
        <span class="ar-mark">AJ</span>
        <span class="ar-wordmark">Alex Jo<span class="ar-cpa">/CPA</span></span>
      </div>
      <div class="aj-nav-links">
        <a href="#about">01 About</a>
        <a href="#services">02 Services</a>
        <a href="#principles">03 Principles</a>
        <a href="#contact">04 Contact</a>
      </div>
      <button class="aj-nav-cta" onclick={openBooking}>Schedule →</button>
    </nav>

    <section class="ar-hero">
      <div class="ar-hero-grid">
        <div class="ar-hero-tag"><span>VAN—BC</span><span>·</span><span>49.2827° N</span><span>·</span><span>123.1207° W</span></div>
        <div class="ar-hero-tag right"><span>Established MMVIII</span><span>·</span><span>CPA, CA</span></div>
        <h1 class="ar-hero-h">
          <span class="ar-line">Precision in</span>
          <span class="ar-line ar-line-italic">numbers.</span>
          <span class="ar-line">Patience in</span>
          <span class="ar-line ar-line-italic">counsel.</span>
        </h1>
        <div class="ar-hero-stat"><div class="ar-stat-n">18</div><div class="ar-stat-l">Years<br/>in practice</div></div>
        <div class="ar-hero-stat"><div class="ar-stat-n">240+</div><div class="ar-stat-l">Active<br/>engagements</div></div>
        <div class="ar-hero-stat"><div class="ar-stat-n">93%</div><div class="ar-stat-l">Decade<br/>retention</div></div>
        <div class="ar-hero-stat"><div class="ar-stat-n">1:1</div><div class="ar-stat-l">Principal<br/>led</div></div>
        <p class="ar-hero-lede">A boutique chartered accountancy in Vancouver, advising families, founders, and professionals on the matters that compound quietly over a lifetime.</p>
        <div class="ar-hero-cta">
          <button class="aj-btn primary" onclick={openBooking}>Book consultation <span class="aj-arrow">→</span></button>
          <a class="aj-btn ghost" href="#services">View services</a>
        </div>
      </div>
    </section>

    <section class="ar-id" id="about">
      <div class="ar-id-head">
        <div class="ar-section-num">§ 01</div>
        <div class="aj-eyebrow ink">Identification</div>
      </div>
      <div class="ar-id-grid">
        <div class="aj-photo ar-portrait" aria-hidden="true">
          <span class="aj-photo-tag">portrait · alex jo, cpa</span>
        </div>
        <div class="ar-id-card">
          {#each [
            ['Principal', 'Alex Jo'],
            ['Designation', 'CPA, CA'],
            ['Articled', 'Big Four, Vancouver'],
            ['Education', 'B.Comm, UBC Sauder'],
            ['Memberships', 'CPABC · CPA Canada'],
            ['Languages', 'English · Korean'],
            ['Office', '885 W Georgia, Suite 1820'],
            ['Practising since', '2008'],
          ] as [k, v] (k)}
            <div class="ar-id-row"><span class="ar-id-k">{k}</span><span class="ar-id-v">{v}</span></div>
          {/each}
        </div>
        <div class="ar-id-statement">
          <p>I work with a small number of clients on engagements that tend to last for many years — and frequently across generations. The practice keeps a deliberately narrow roster so that every file receives the principal's attention from intake through filing.</p>
          <p>My approach favours plain language, calendared touchpoints, and counsel that errs on the side of conservatism. There is no junior bench, no upsell, and no surprises at year-end.</p>
        </div>
      </div>
    </section>

    <section class="ar-services" id="services">
      <div class="ar-id-head">
        <div class="ar-section-num">§ 02</div>
        <div class="aj-eyebrow ink">Services</div>
      </div>
      <div class="ar-svc-grid">
        {#each [
          { n: 'A', t: 'Personal Tax', items: ['T1 returns', 'Cross-border (US/CA)', 'Capital gains planning', 'CRA representation'] },
          { n: 'B', t: 'Corporate', items: ['T2 corporate filings', 'Year-end & financials', 'Compensation planning', 'GST/PST compliance'] },
          { n: 'C', t: 'Estate & Trust', items: ['Estate freezes', 'Family-trust admin', 'Executor support', 'Intergenerational transfer'] },
          { n: 'D', t: 'Assurance', items: ['Audit engagements', 'Review engagements', 'Compilation', 'Not-for-profit'] },
          { n: 'E', t: 'Advisory', items: ['Business valuation', 'Litigation support', 'Forensic accounting', 'M&A due diligence'] },
          { n: 'F', t: 'Family Office', items: ['Consolidated reporting', 'Cash-flow architecture', 'Bookkeeping oversight', 'Quarterly reviews'] },
        ] as s (s.n)}
          <article class="ar-svc-card">
            <div class="ar-svc-head"><span class="ar-svc-n">{s.n}</span><h3 class="ar-svc-t">{s.t}</h3></div>
            <ul class="ar-svc-items">{#each s.items as item (item)}<li>{item}</li>{/each}</ul>
            <div class="ar-svc-foot"><span>Engagement →</span></div>
          </article>
        {/each}
      </div>
    </section>

    <section class="ar-principles" id="principles">
      <div class="ar-id-head">
        <div class="ar-section-num">§ 03</div>
        <div class="aj-eyebrow">Principles of practice</div>
      </div>
      <div class="ar-principles-grid">
        <div class="ar-principle"><div class="ar-pr-num">i.</div><h3>Discretion</h3><p>Every engagement is treated as confidential by default. Files are encrypted, principal-reviewed, and never shared without express instruction.</p></div>
        <div class="ar-principle"><div class="ar-pr-num">ii.</div><h3>Continuity</h3><p>You will not be passed between juniors. The principal retains the file from intake to filing — and through whatever follows.</p></div>
        <div class="ar-principle"><div class="ar-pr-num">iii.</div><h3>Conservatism</h3><p>We err on the careful side. Aggressive positions are taken only when fully defensible — never to chase a short-term saving.</p></div>
        <div class="ar-principle"><div class="ar-pr-num">iv.</div><h3>Counsel</h3><p>We answer the question you asked, and the one you didn't. Plain language. Calendared touchpoints. No upsells.</p></div>
      </div>
    </section>

    <section class="ar-office">
      <div class="aj-photo dark ar-office-img" aria-hidden="true">
        <span class="aj-photo-tag">vancouver · howe st. office</span>
      </div>
      <div class="ar-office-overlay">
        <div class="ar-office-tag">
          <span>STE 1820</span><span>·</span><span>885 W GEORGIA</span><span>·</span><span>VAN BC V6C 3E8</span>
        </div>
        <h2 class="ar-office-h">By appointment, in the<br/>downtown peninsula.</h2>
      </div>
    </section>

    <section class="ar-cta" id="contact">
      <div class="ar-id-head">
        <div class="ar-section-num">§ 04</div>
        <div class="aj-eyebrow ink">Engage</div>
      </div>
      <div class="ar-cta-grid">
        <h2 class="ar-cta-h">A complimentary consultation,<br/>at your convenience.</h2>
        <div class="ar-cta-side">
          <p>Initial conversations last 30–60 minutes and are held by appointment at our Howe Street offices, or by video. New clients are accepted by referral and through direct enquiry.</p>
          <div class="ar-cta-rows">
            <div class="ar-cta-row"><span>Email</span><a href="mailto:office@alexjocpa.ca">office@alexjocpa.ca</a></div>
            <div class="ar-cta-row"><span>Telephone</span><a href="tel:+16045550182">+1 604 555 0182</a></div>
            <div class="ar-cta-row"><span>Hours</span><span>Tue–Fri · 09:00–17:00 PT</span></div>
          </div>
          <button class="aj-btn primary" onclick={openBooking} style="margin-top: 24px">Schedule consultation <span class="aj-arrow">→</span></button>
        </div>
      </div>
    </section>

    <footer class="aj-footer">
      <div class="grid">
        <div>
          <h3 class="firm-name">Alex Jo, CPA</h3>
          <p class="firm-blurb">A boutique chartered professional accountancy serving British Columbia families, founders, and professionals since 2008.</p>
        </div>
        <div>
          <h4>Practice</h4>
          <ul>
            <li><a href="/demo/alexjo">Personal Tax</a></li>
            <li><a href="/demo/alexjo">Owner-Managed</a></li>
            <li><a href="/demo/alexjo">Estate & Trust</a></li>
            <li><a href="/demo/alexjo">Assurance</a></li>
            <li><a href="/demo/alexjo">Advisory</a></li>
          </ul>
        </div>
        <div>
          <h4>Office</h4>
          <ul>
            <li>Suite 1820</li>
            <li>885 West Georgia St</li>
            <li>Vancouver, BC V6C 3E8</li>
            <li>+1 604 555 0182</li>
          </ul>
        </div>
        <div>
          <h4>Connect</h4>
          <ul>
            <li><a href="/demo/alexjo">LinkedIn</a></li>
            <li><a href="mailto:office@alexjocpa.ca">Email</a></li>
            <li><a href="/demo/alexjo">Secure portal</a></li>
          </ul>
        </div>
      </div>
      <div class="meta">
        <span>© 2026 Alex Jo, Chartered Professional Accountant Inc.</span>
        <span>Member · CPABC</span>
      </div>
    </footer>

  {:else}
    <!-- ===================================================== -->
    <!-- DIRECTION C — PORTRAIT-LED                            -->
    <!-- ===================================================== -->

    <nav class="aj-nav pr-nav">
      <div class="aj-logo"><span class="pr-mono">A.J.</span></div>
      <div class="aj-nav-links">
        <a href="#about">About</a>
        <a href="#services">Practice</a>
        <a href="#letter">Letter</a>
        <a href="#contact">Contact</a>
      </div>
      <button class="aj-nav-cta" onclick={openBooking}>Book</button>
    </nav>

    <section class="pr-hero">
      <div class="pr-hero-left">
        <div class="aj-photo pr-portrait" aria-hidden="true">
          <span class="aj-photo-tag">portrait · alex jo, cpa, ca</span>
        </div>
        <div class="pr-portrait-meta">
          <span>Photographed Vancouver, MMXXVI</span>
          <span>№ 01 / 04</span>
        </div>
      </div>
      <div class="pr-hero-right">
        <div class="aj-eyebrow">Vancouver, BC · Est. 2008</div>
        <h1 class="pr-hero-h">Alex Jo,<br/><em>Chartered</em><br/>Professional<br/>Accountant.</h1>
        <p class="pr-hero-sig">A small practice. A long view. A direct line.</p>
        <div class="pr-hero-actions">
          <button class="aj-btn primary" onclick={openBooking}>Request a meeting <span class="aj-arrow">→</span></button>
          <a class="aj-btn ghost" href="#letter">Read the letter</a>
        </div>
        <div class="pr-hero-creds">
          <div><div class="pr-cred-k">Designation</div><div class="pr-cred-v">CPA, CA</div></div>
          <div><div class="pr-cred-k">Articled</div><div class="pr-cred-v">Big Four</div></div>
          <div><div class="pr-cred-k">Education</div><div class="pr-cred-v">UBC Sauder</div></div>
          <div><div class="pr-cred-k">In practice</div><div class="pr-cred-v">18 years</div></div>
        </div>
      </div>
    </section>

    <section class="pr-quote">
      <div class="pr-quote-mark">"</div>
      <blockquote class="pr-quote-text">
        The numbers, in the end, are the easy part. What matters is understanding the family or the business behind them — and being patient enough to do so well.
      </blockquote>
      <div class="pr-quote-attr">— Alex Jo, Principal</div>
    </section>

    <section class="pr-letter" id="letter">
      <div class="pr-letter-grid">
        <div class="pr-letter-side">
          <div class="aj-eyebrow ink">A letter from the principal</div>
          <div class="pr-letter-date">Howe Street, Vancouver<br/>Spring, MMXXVI</div>
        </div>
        <div class="pr-letter-body">
          <p class="pr-letter-greet">Dear reader,</p>
          <p>I founded this practice eighteen years ago on a simple conviction: that financial counsel, done well, is a <em>relationship</em> more than a transaction. The clients who came to me first are, by and large, still here — and many have introduced their children, and a few their grandchildren.</p>
          <p>We are deliberately small. There is no junior bench, no associate to whom your file is handed. When you call, I answer. When your circumstances change — a sale, a marriage, a death, a new venture — we revisit the structure together, calmly, and we adjust.</p>
          <p>If the work I do is the work you need, I would be glad to speak. If it isn't, I will tell you, and point you somewhere better.</p>
          <p class="pr-letter-sign">Yours faithfully,</p>
          <div class="pr-letter-signature">Alex Jo</div>
          <div class="pr-letter-credline">CPA, CA · Principal</div>
        </div>
      </div>
    </section>

    <section class="pr-services" id="services">
      <div class="pr-services-head">
        <div class="aj-eyebrow">The practice</div>
        <h2 class="pr-h2">What we do, and<br/>for whom we do it.</h2>
      </div>
      <div class="pr-svc-grid">
        {#each [
          { n: 'i', t: 'Personal Tax & Planning', d: 'For individuals and households navigating multi-jurisdictional filings, capital events, and the long-horizon architecture of a financial life.', tags: ['T1 returns', 'Cross-border', 'Capital gains', 'CRA representation'] },
          { n: 'ii', t: 'Owner-Managed Business', d: 'For founders and operators of closely held companies — year-end, T2 filings, compensation planning, and the considered counsel a holding company deserves.', tags: ['T2 corporate', 'Year-end', 'Compensation', 'GST/PST'] },
          { n: 'iii', t: 'Estate, Trust & Succession', d: 'For families and executors thinking across generations — estate freezes, trust administration, and the structural work that quietly compounds over decades.', tags: ['Estate freezes', 'Family trusts', 'Executor support', 'Succession'] },
          { n: 'iv', t: 'Assurance & Advisory', d: 'For private companies and not-for-profits requiring audit, review, or compilation — and for sensitive situations where forensic care is warranted.', tags: ['Audit', 'Review', 'Compilation', 'Forensic'] },
        ] as s (s.n)}
          <div class="pr-svc-row">
            <div class="pr-svc-num">{s.n}</div>
            <div class="pr-svc-body">
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <div class="pr-svc-tags">{#each s.tags as tag (tag)}<span>{tag}</span>{/each}</div>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <section class="pr-cta" id="contact">
      <div class="pr-cta-inner">
        <div class="pr-cta-mark">A.J.</div>
        <h2 class="pr-cta-h">Begin a quiet,<br/><em>considered</em> conversation.</h2>
        <p>Initial consultations are complimentary, by appointment, and held in confidence. If your matter is suited to the practice, we will be in touch within one business day.</p>
        <div class="pr-cta-actions">
          <button class="aj-btn primary" onclick={openBooking}>Book consultation <span class="aj-arrow">→</span></button>
          <a class="aj-btn ghost" href="mailto:office@alexjocpa.ca">office@alexjocpa.ca</a>
        </div>
        <div class="pr-cta-foot">
          <span>+1 604 555 0182</span><span>·</span><span>Tue–Fri · 09:00–17:00 PT</span><span>·</span><span>Howe Street, Vancouver</span>
        </div>
      </div>
    </section>

    <footer class="aj-footer">
      <div class="grid">
        <div>
          <h3 class="firm-name">Alex Jo, CPA</h3>
          <p class="firm-blurb">A boutique chartered professional accountancy serving British Columbia families, founders, and professionals since 2008.</p>
        </div>
        <div>
          <h4>Practice</h4>
          <ul>
            <li><a href="/demo/alexjo">Personal Tax</a></li>
            <li><a href="/demo/alexjo">Owner-Managed</a></li>
            <li><a href="/demo/alexjo">Estate & Trust</a></li>
            <li><a href="/demo/alexjo">Assurance</a></li>
            <li><a href="/demo/alexjo">Advisory</a></li>
          </ul>
        </div>
        <div>
          <h4>Office</h4>
          <ul>
            <li>Suite 1820</li>
            <li>885 West Georgia St</li>
            <li>Vancouver, BC V6C 3E8</li>
            <li>+1 604 555 0182</li>
          </ul>
        </div>
        <div>
          <h4>Connect</h4>
          <ul>
            <li><a href="/demo/alexjo">LinkedIn</a></li>
            <li><a href="mailto:office@alexjocpa.ca">Email</a></li>
            <li><a href="/demo/alexjo">Secure portal</a></li>
          </ul>
        </div>
      </div>
      <div class="meta">
        <span>© 2026 Alex Jo, Chartered Professional Accountant Inc.</span>
        <span>Member · CPABC</span>
      </div>
    </footer>

  {/if}
</div>

<!-- ===================================================== -->
<!-- BOOKING MODAL — shared across all directions          -->
<!-- ===================================================== -->
{#if bookingOpen}
<div class="bk-overlay" role="dialog" aria-modal="true" tabindex="-1" onclick={(e) => { if ((e.target as HTMLElement).classList.contains('bk-overlay')) closeBooking(); }} onkeydown={(e) => { if (e.key === 'Escape') closeBooking(); }}>
  <div class="bk-modal">
    <aside class="bk-side">
      <div class="bk-logo"><span class="mark">A</span><span>Alex Jo, CPA</span></div>
      <div class="bk-steps">
        {#each ['Choose service', 'Pick a time', 'Your details'] as title, i (title)}
          <div class="bk-step-item" class:active={bookingStep === i && !bookingConfirmed} class:done={bookingStep > i || bookingConfirmed}>
            <div class="bk-step-num">{bookingStep > i || bookingConfirmed ? '✓' : String(i + 1).padStart(2, '0')}</div>
            <div>
              <div class="bk-step-label">Step {String(i + 1).padStart(2, '0')}</div>
              <div class="bk-step-title">{title}</div>
            </div>
          </div>
        {/each}
      </div>
      <div class="bk-side-foot">Vancouver · Pacific Time</div>
    </aside>
    <div class="bk-main">
      <button class="bk-close" onclick={closeBooking} aria-label="Close">×</button>
      {#if bookingConfirmed}
        <div class="bk-success">
          <div class="bk-check">✓</div>
          <h3>Consultation requested</h3>
          <p>Thank you, {bookingDetails.first}. A confirmation has been sent to {bookingDetails.email}. Alex's office will reach out within one business day.</p>
          <button class="aj-btn primary" onclick={closeBooking} style="margin-top: 16px">Close</button>
        </div>
      {:else if bookingStep === 0}
        <div class="bk-eyebrow">Step 01 of 03</div>
        <h2 class="bk-h">What can we help you with?</h2>
        <p class="bk-sub">Initial consultations are complimentary. Select a focus area and we'll match you with the appropriate engagement.</p>
        <div class="bk-services">
          {#each SERVICES as s (s.id)}
            <button class="bk-service" class:selected={bookingService === s.id} onclick={() => bookingService = s.id}>
              <div>
                <div class="name">{s.name}</div>
                <div class="desc">{s.desc}</div>
              </div>
              <div class="duration">{s.duration}</div>
            </button>
          {/each}
        </div>
      {:else if bookingStep === 1}
        <div class="bk-eyebrow">Step 02 of 03</div>
        <h2 class="bk-h">Select a date and time</h2>
        <p class="bk-sub">Available Tuesday through Friday. All times Pacific Time (Vancouver).</p>
        <div class="bk-date-simple">
          <input type="date" class="bk-date-input" onchange={(e) => { bookingDate = e.currentTarget.value ? new Date(e.currentTarget.value + 'T12:00:00') : null; bookingTime = null; }} />
          {#if bookingDate}
            <div class="bk-times">
              {#each ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'] as t (t)}
                <button class="bk-time" class:selected={bookingTime === t} onclick={() => bookingTime = t}>{t}</button>
              {/each}
            </div>
          {/if}
        </div>
      {:else}
        <div class="bk-eyebrow">Step 03 of 03</div>
        <h2 class="bk-h">Your details</h2>
        <p class="bk-sub">All correspondence is confidential. We respond within one business day.</p>
        <div class="bk-form">
          <div class="bk-row">
            <div class="bk-field"><label for="bk-first">First name</label><input id="bk-first" value={bookingDetails.first} oninput={(e) => bookingDetails.first = e.currentTarget.value} /></div>
            <div class="bk-field"><label for="bk-last">Last name</label><input id="bk-last" value={bookingDetails.last} oninput={(e) => bookingDetails.last = e.currentTarget.value} /></div>
          </div>
          <div class="bk-row">
            <div class="bk-field"><label for="bk-email">Email</label><input id="bk-email" type="email" value={bookingDetails.email} oninput={(e) => bookingDetails.email = e.currentTarget.value} /></div>
            <div class="bk-field"><label for="bk-phone">Phone (optional)</label><input id="bk-phone" value={bookingDetails.phone} oninput={(e) => bookingDetails.phone = e.currentTarget.value} /></div>
          </div>
        </div>
      {/if}
      {#if !bookingConfirmed}
        <div class="bk-actions">
          <button class="bk-back" onclick={() => { if (bookingStep > 0) bookingStep--; }} disabled={bookingStep === 0}>← Back</button>
          <button class="aj-btn primary" onclick={bookingNext} disabled={!isValid} style="opacity: {isValid ? 1 : 0.4}">
            {bookingStep === 2 ? 'Request consultation' : 'Continue'} <span class="aj-arrow">→</span>
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
{/if}

<style>
  /* === CSS VAR MAPPING === */
  :global(.demo-root) {
    --ivory: var(--bg);
    --ivory-2: color-mix(in srgb, var(--bg) 60%, #fff);
    --mist: color-mix(in srgb, var(--bg) 40%, #e8e2d5);
    --gold: var(--accent);
    --gold-soft: var(--accent2);
    --rule: var(--line);
    --rule-strong: rgba(14, 27, 44, 0.32);
    --serif: "Cormorant Garamond", "EB Garamond", Georgia, serif;
    --sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    --mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
  }

  /* === SHARED AJ STYLES === */
  .aj-root {
    font-family: var(--sans);
    color: var(--ink);
    background: var(--ivory);
    -webkit-font-smoothing: antialiased;
    letter-spacing: -0.005em;
  }

  .aj-eyebrow {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
  }
  .aj-eyebrow.ink { color: var(--ink-soft); }

  .aj-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 24px;
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.04em;
    border-radius: 999px;
    cursor: pointer;
    transition: all 220ms ease;
    border: 1px solid transparent;
    text-decoration: none;
  }
  .aj-btn.primary { background: var(--ink); color: var(--ivory); }
  .aj-btn.primary:hover { background: var(--ink-soft); transform: translateY(-1px); }
  .aj-btn.ghost { background: transparent; color: var(--ink); border-color: var(--rule-strong); }
  .aj-btn.ghost:hover { background: var(--ink); color: var(--ivory); }

  .aj-arrow { transition: transform 220ms ease; }
  .aj-btn:hover .aj-arrow { transform: translateX(3px); }

  .aj-photo {
    position: relative;
    background:
      repeating-linear-gradient(135deg, rgba(14,27,44,0.05) 0px, rgba(14,27,44,0.05) 1px, transparent 1px, transparent 9px),
      linear-gradient(180deg, #DDD4C2 0%, #C9BFA8 100%);
    overflow: hidden;
  }
  .aj-photo.dark {
    background:
      repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 9px),
      linear-gradient(180deg, #1A2A40 0%, #0A1422 100%);
  }
  .aj-photo-tag {
    position: absolute;
    bottom: 14px;
    left: 14px;
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(14,27,44,0.55);
    background: rgba(245,241,234,0.85);
    padding: 4px 8px;
    border-radius: 2px;
  }
  .aj-photo.dark .aj-photo-tag {
    color: rgba(245,241,234,0.7);
    background: rgba(14,27,44,0.6);
  }

  .aj-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 48px;
    border-bottom: 1px solid var(--rule);
    position: sticky;
    top: 44px; /* account for DemoBanner height */
    background: var(--ivory);
    z-index: 10;
    backdrop-filter: blur(10px);
  }
  .aj-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: var(--serif);
    font-size: 22px;
    font-weight: 500;
    letter-spacing: -0.01em;
  }
  .aj-logo .mark {
    width: 28px; height: 28px;
    border: 1px solid currentColor;
    display: grid;
    place-items: center;
    font-family: var(--serif);
    font-size: 14px;
    font-style: italic;
  }
  .aj-nav-links { display: flex; gap: 36px; font-size: 13px; font-weight: 500; letter-spacing: 0.02em; }
  .aj-nav-links a { color: inherit; text-decoration: none; opacity: 0.85; transition: opacity 200ms; }
  .aj-nav-links a:hover { opacity: 1; }
  .aj-nav-cta {
    font-size: 12px;
    padding: 10px 18px;
    border: 1px solid currentColor;
    border-radius: 999px;
    cursor: pointer;
    background: transparent;
    color: inherit;
    letter-spacing: 0.04em;
    font-weight: 500;
    transition: all 200ms;
  }
  .aj-nav-cta:hover { background: var(--ink); color: var(--ivory); }

  .aj-footer {
    background: var(--ink);
    color: var(--ivory);
    padding: 80px 48px 40px;
  }
  .aj-footer .grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 60px;
    padding-bottom: 60px;
    border-bottom: 1px solid rgba(245,241,234,0.12);
  }
  .aj-footer h4 {
    font-family: var(--sans);
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold-soft);
    font-weight: 500;
    margin: 0 0 18px;
  }
  .aj-footer ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; font-size: 14px; }
  .aj-footer ul a { color: rgba(245,241,234,0.75); text-decoration: none; transition: color 200ms; }
  .aj-footer ul a:hover { color: var(--ivory); }
  .aj-footer .meta {
    display: flex;
    justify-content: space-between;
    padding-top: 28px;
    font-size: 12px;
    color: rgba(245,241,234,0.55);
    font-family: var(--mono);
    letter-spacing: 0.05em;
  }
  .aj-footer .firm-name { font-family: var(--serif); font-size: 26px; margin: 0 0 16px; }
  .aj-footer .firm-blurb { font-size: 14px; line-height: 1.7; color: rgba(245,241,234,0.65); max-width: 360px; }

  /* === DIRECTION A — EDITORIAL === */
  .ed-root { background: var(--ivory); }

  .ed-hero {
    padding: 100px 64px 80px;
    display: grid;
    gap: 56px;
    border-bottom: 1px solid var(--rule);
  }
  .ed-hero-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--ink-soft);
    text-transform: uppercase;
  }
  .ed-hero-meta-right { display: flex; gap: 12px; }
  .ed-hero-h {
    font-family: var(--serif);
    font-size: clamp(64px, 9vw, 144px);
    line-height: 0.95;
    font-weight: 400;
    letter-spacing: -0.025em;
    margin: 0;
    color: var(--ink);
  }
  .ed-hero-h em { font-style: italic; color: var(--gold); font-weight: 400; }
  .ed-hero-foot {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: end;
    padding-top: 32px;
    border-top: 1px solid var(--rule);
  }
  .ed-hero-lede {
    font-family: var(--serif);
    font-size: 22px;
    line-height: 1.45;
    margin: 0;
    max-width: 540px;
    font-weight: 400;
  }
  .ed-hero-actions { display: flex; gap: 12px; justify-content: flex-end; }

  .ed-strip {
    background: var(--ink);
    color: var(--ivory);
    padding: 18px 0;
    overflow: hidden;
  }
  .ed-strip-inner {
    display: flex;
    gap: 28px;
    justify-content: center;
    flex-wrap: wrap;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(245,241,234,0.72);
  }
  .ed-strip-inner .dot { color: var(--gold-soft); }

  .ed-intro { padding: 120px 64px; }
  .ed-intro-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 96px; align-items: start; }
  .ed-pull {
    font-family: var(--serif);
    font-size: 38px;
    line-height: 1.2;
    font-weight: 400;
    font-style: italic;
    margin: 24px 0 32px;
    color: var(--ink);
    letter-spacing: -0.015em;
    max-width: 580px;
  }
  .ed-pull::before { content: "\201C"; color: var(--gold); margin-right: 4px; }
  .ed-pull::after { content: "\201D"; color: var(--gold); }
  .ed-body { font-size: 15px; line-height: 1.7; color: var(--ink-soft); max-width: 480px; margin: 0 0 36px; }
  .ed-sig { display: flex; align-items: baseline; gap: 16px; padding-top: 24px; border-top: 1px solid var(--rule); }
  .ed-sig-mark { font-family: var(--serif); font-style: italic; font-size: 28px; color: var(--ink); }
  .ed-sig-meta { font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); }
  .ed-portrait { aspect-ratio: 4 / 5; width: 100%; }
  .ed-portrait-cap {
    display: flex;
    justify-content: space-between;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    color: var(--ink-soft);
    text-transform: uppercase;
    margin-top: 14px;
    line-height: 1.5;
  }
  .ed-portrait-num { font-family: var(--serif); font-size: 28px; font-style: italic; color: var(--gold); }

  .ed-services { padding: 120px 64px; border-top: 1px solid var(--rule); }
  .ed-services-head { display: grid; grid-template-columns: 1fr 2fr; gap: 80px; margin-bottom: 80px; align-items: end; }
  .ed-h2 {
    font-family: var(--serif);
    font-size: clamp(44px, 5.5vw, 84px);
    line-height: 1;
    font-weight: 400;
    letter-spacing: -0.02em;
    margin: 0;
    color: var(--ink);
  }
  .ed-h2 em { font-style: italic; color: var(--gold); }
  .ed-h2-light {
    font-family: var(--serif);
    font-size: clamp(38px, 4vw, 60px);
    line-height: 1.05;
    font-weight: 400;
    letter-spacing: -0.02em;
    margin: 0 0 48px;
    color: var(--ivory);
  }
  .ed-h2-light em { font-style: italic; color: var(--gold-soft); }

  .ed-svc-list { display: grid; }
  .ed-svc {
    display: grid;
    grid-template-columns: 80px 2fr 3fr auto;
    gap: 48px;
    padding: 36px 0;
    border-top: 1px solid var(--rule);
    align-items: baseline;
    cursor: pointer;
    transition: background 240ms;
  }
  .ed-svc:last-child { border-bottom: 1px solid var(--rule); }
  .ed-svc:hover { background: var(--ivory-2); }
  .ed-svc-n { font-family: var(--mono); font-size: 12px; color: var(--gold); letter-spacing: 0.08em; }
  .ed-svc-t { font-family: var(--serif); font-size: 30px; font-weight: 400; margin: 0; letter-spacing: -0.015em; }
  .ed-svc-d { font-size: 14px; line-height: 1.65; color: var(--ink-soft); margin: 0; max-width: 480px; }
  .ed-svc-link { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink); text-decoration: none; white-space: nowrap; opacity: 0; transition: opacity 240ms; }
  .ed-svc:hover .ed-svc-link { opacity: 1; }

  .ed-approach { background: var(--ink); color: var(--ivory); display: grid; grid-template-columns: 1fr 1fr; }
  .ed-approach-img { height: 100%; min-height: 600px; }
  .ed-approach-text { padding: 100px 80px; align-content: center; display: grid; }
  .ed-approach-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px 40px; }
  .ed-approach-grid h4 { font-family: var(--serif); font-size: 22px; font-weight: 400; margin: 0 0 10px; color: var(--gold-soft); font-style: italic; }
  .ed-approach-grid p { font-size: 14px; line-height: 1.65; color: rgba(245,241,234,0.7); margin: 0; }

  .ed-figures {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 80px 64px;
    border-top: 1px solid var(--rule);
  }
  .ed-fig { padding: 0 32px; border-left: 1px solid var(--rule); }
  .ed-fig:first-child { border-left: 0; padding-left: 0; }
  .ed-fig-n { font-family: var(--serif); font-size: 72px; line-height: 1; font-weight: 400; color: var(--ink); margin-bottom: 14px; letter-spacing: -0.02em; }
  .ed-fig-l { font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); }

  .ed-cta { padding: 140px 64px; border-top: 1px solid var(--rule); text-align: center; background: var(--paper); }
  .ed-cta-inner { max-width: 760px; margin: 0 auto; }
  .ed-cta-sub { font-family: var(--serif); font-size: 18px; line-height: 1.6; color: var(--ink-soft); margin: 28px auto 40px; max-width: 540px; }
  .ed-cta-actions { display: flex; gap: 12px; justify-content: center; }

  /* === DIRECTION B — ARCHITECTURAL === */
  .ar-root { background: var(--paper); }

  .ar-nav { padding: 20px 56px; }
  .ar-mark {
    width: 36px; height: 36px;
    background: var(--ink);
    color: var(--ivory);
    display: grid;
    place-items: center;
    font-family: var(--serif);
    font-style: italic;
    font-size: 16px;
  }
  .ar-wordmark { font-family: var(--serif); font-size: 22px; letter-spacing: -0.01em; display: flex; align-items: baseline; gap: 4px; }
  .ar-cpa { font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; color: var(--gold); }

  .ar-hero { padding: 72px 56px 100px; }
  .ar-hero-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 32px 24px;
    align-items: end;
  }
  .ar-hero-tag {
    grid-column: 1 / 7;
    display: flex;
    gap: 10px;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    color: var(--ink-soft);
    text-transform: uppercase;
    align-self: start;
  }
  .ar-hero-tag.right { grid-column: 7 / 13; justify-content: flex-end; }
  .ar-hero-h {
    grid-column: 1 / 13;
    font-family: var(--serif);
    font-size: clamp(72px, 11vw, 168px);
    font-weight: 400;
    line-height: 0.92;
    letter-spacing: -0.03em;
    margin: 24px 0 0;
    display: grid;
  }
  .ar-line { display: block; }
  .ar-line-italic { font-style: italic; color: var(--gold); padding-left: 0.4em; }
  .ar-hero-stat {
    grid-column: span 3;
    border-top: 1px solid var(--rule-strong);
    padding-top: 18px;
    margin-top: 24px;
  }
  .ar-stat-n { font-family: var(--serif); font-size: 48px; line-height: 1; font-weight: 400; letter-spacing: -0.02em; margin-bottom: 12px; }
  .ar-stat-l { font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); line-height: 1.5; }
  .ar-hero-lede { grid-column: 1 / 8; font-family: var(--serif); font-size: 22px; line-height: 1.45; margin: 32px 0 0; font-style: italic; }
  .ar-hero-cta { grid-column: 9 / 13; display: flex; gap: 10px; justify-content: flex-end; margin-top: 32px; }

  .ar-id-head { display: flex; align-items: baseline; gap: 16px; padding: 0 56px; margin-bottom: 56px; }
  .ar-section-num { font-family: var(--serif); font-style: italic; font-size: 22px; color: var(--gold); }

  .ar-id { padding: 100px 0; border-top: 1px solid var(--rule-strong); background: var(--ivory); }
  .ar-id-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; padding: 0 56px; align-items: start; }
  .ar-portrait { aspect-ratio: 3 / 4; }
  .ar-id-card { border: 1px solid var(--rule-strong); background: var(--paper); padding: 4px 0; }
  .ar-id-row { display: grid; grid-template-columns: 130px 1fr; padding: 14px 20px; border-bottom: 1px solid var(--rule); font-size: 14px; }
  .ar-id-row:last-child { border-bottom: 0; }
  .ar-id-k { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); align-self: center; }
  .ar-id-v { font-family: var(--serif); font-size: 17px; }
  .ar-id-statement p { font-size: 15px; line-height: 1.7; margin: 0 0 18px; max-width: 380px; }

  .ar-services { padding: 100px 0; border-top: 1px solid var(--rule-strong); }
  .ar-svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); padding: 0 56px; border-top: 1px solid var(--rule-strong); }
  .ar-svc-card {
    border-right: 1px solid var(--rule);
    padding: 40px 32px;
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: 20px;
  }
  .ar-svc-card:last-child, .ar-svc-card:nth-child(3n) { border-right: none; }
  .ar-svc-head { display: flex; align-items: baseline; gap: 14px; }
  .ar-svc-n { font-family: var(--serif); font-style: italic; font-size: 28px; color: var(--gold); }
  .ar-svc-t { font-family: var(--serif); font-size: 26px; font-weight: 400; margin: 0; }
  .ar-svc-items { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; font-size: 14px; color: var(--ink-soft); }
  .ar-svc-items li::before { content: "—  "; color: var(--gold); font-size: 12px; }
  .ar-svc-foot { font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft); padding-top: 16px; border-top: 1px solid var(--rule); cursor: pointer; }

  .ar-principles { padding: 100px 0; border-top: 1px solid var(--rule-strong); background: var(--ivory); }
  .ar-principles-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; padding: 0 56px; }
  .ar-principle { padding: 0 32px; border-left: 1px solid var(--rule); }
  .ar-principle:first-child { border-left: none; padding-left: 0; }
  .ar-pr-num { font-family: var(--serif); font-style: italic; font-size: 32px; color: var(--gold); margin-bottom: 16px; }
  .ar-principle h3 { font-family: var(--serif); font-size: 26px; font-weight: 400; margin: 0 0 14px; }
  .ar-principle p { font-size: 14px; line-height: 1.7; color: var(--ink-soft); margin: 0; }

  .ar-office { position: relative; }
  .ar-office-img { height: 500px; width: 100%; }
  .ar-office-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 56px;
    background: linear-gradient(to top, rgba(14,27,44,0.8) 0%, transparent 60%);
    color: var(--ivory);
  }
  .ar-office-tag { display: flex; gap: 12px; font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(245,241,234,0.65); margin-bottom: 16px; }
  .ar-office-h { font-family: var(--serif); font-size: clamp(36px, 4vw, 60px); font-weight: 400; margin: 0; line-height: 1.1; }

  .ar-cta { padding: 100px 0; border-top: 1px solid var(--rule-strong); }
  .ar-cta-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 80px; padding: 0 56px; align-items: start; }
  .ar-cta-h { font-family: var(--serif); font-size: clamp(40px, 5vw, 72px); font-weight: 400; line-height: 1.05; margin: 0; letter-spacing: -0.02em; }
  .ar-cta-side p { font-size: 15px; line-height: 1.7; color: var(--ink-soft); margin: 0 0 24px; }
  .ar-cta-rows { display: grid; gap: 14px; }
  .ar-cta-row { display: grid; grid-template-columns: 100px 1fr; font-size: 14px; padding-bottom: 14px; border-bottom: 1px solid var(--rule); }
  .ar-cta-row span:first-child { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); align-self: center; }
  .ar-cta-row a { color: var(--ink); text-decoration: none; }
  .ar-cta-row a:hover { color: var(--gold); }

  /* === DIRECTION C — PORTRAIT === */
  .pr-root { background: var(--paper); }

  .pr-nav { padding: 22px 56px; }
  .pr-mono { font-family: var(--serif); font-style: italic; font-size: 26px; letter-spacing: 0.02em; }

  .pr-hero { display: grid; grid-template-columns: 1fr 1.1fr; min-height: calc(100vh - 114px); border-bottom: 1px solid var(--rule); }
  .pr-hero-left { padding: 48px 32px 48px 56px; display: flex; flex-direction: column; }
  .pr-portrait { flex: 1; aspect-ratio: 4 / 5; }
  .pr-portrait-meta {
    display: flex; justify-content: space-between;
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink-soft);
    padding-top: 14px;
  }
  .pr-hero-right {
    padding: 80px 56px 48px 48px;
    display: flex; flex-direction: column;
    justify-content: center;
    border-left: 1px solid var(--rule);
  }
  .pr-hero-h {
    font-family: var(--serif);
    font-size: clamp(56px, 7vw, 110px);
    font-weight: 400;
    line-height: 0.96;
    letter-spacing: -0.025em;
    margin: 24px 0 32px;
    color: var(--ink);
  }
  .pr-hero-h em { font-style: italic; color: var(--gold); font-weight: 400; }
  .pr-hero-sig { font-family: var(--serif); font-style: italic; font-size: 22px; line-height: 1.5; color: var(--ink-soft); margin: 0 0 36px; max-width: 480px; }
  .pr-hero-actions { display: flex; gap: 12px; margin-bottom: 64px; }
  .pr-hero-creds { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--rule); padding-top: 24px; gap: 24px; }
  .pr-cred-k { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 8px; }
  .pr-cred-v { font-family: var(--serif); font-size: 22px; letter-spacing: -0.01em; }

  .pr-quote { background: var(--ink); color: var(--ivory); padding: 100px 56px; text-align: center; }
  .pr-quote-mark { font-family: var(--serif); font-size: 100px; line-height: 0.6; color: var(--gold-soft); font-style: italic; margin-bottom: 16px; }
  .pr-quote-text { font-family: var(--serif); font-size: clamp(28px, 3.4vw, 50px); line-height: 1.25; font-weight: 400; font-style: italic; letter-spacing: -0.015em; margin: 0 auto 32px; max-width: 1100px; }
  .pr-quote-attr { font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(245,241,234,0.65); }

  .pr-letter { padding: 120px 56px; }
  .pr-letter-grid { display: grid; grid-template-columns: 1fr 2.2fr; gap: 80px; max-width: 1280px; margin: 0 auto; align-items: start; }
  .pr-letter-side { position: sticky; top: 100px; }
  .pr-letter-date { font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft); margin-top: 16px; line-height: 1.6; }
  .pr-letter-body { font-family: var(--serif); font-size: 22px; line-height: 1.55; color: var(--ink); }
  .pr-letter-body p { margin: 0 0 24px; max-width: 680px; }
  .pr-letter-body em { font-style: italic; color: var(--gold); }
  .pr-letter-greet { font-style: italic; }
  .pr-letter-sign { font-style: italic; }
  .pr-letter-signature { font-family: var(--serif); font-style: italic; font-size: 56px; color: var(--ink); margin-bottom: 8px; line-height: 1; }
  .pr-letter-credline { font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); }

  .pr-services { padding: 120px 56px; background: var(--ivory); border-top: 1px solid var(--rule); }
  .pr-services-head { display: grid; grid-template-columns: 1fr 2fr; gap: 80px; margin-bottom: 80px; align-items: end; }
  .pr-h2 { font-family: var(--serif); font-size: clamp(48px, 6vw, 88px); line-height: 1; font-weight: 400; letter-spacing: -0.025em; margin: 0; }
  .pr-svc-grid { max-width: 1400px; margin: 0 auto; }
  .pr-svc-row { display: grid; grid-template-columns: 100px 1fr; gap: 32px; padding: 48px 0; border-top: 1px solid var(--rule); align-items: start; }
  .pr-svc-row:last-child { border-bottom: 1px solid var(--rule); }
  .pr-svc-num { font-family: var(--serif); font-style: italic; font-size: 36px; color: var(--gold); }
  .pr-svc-body { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
  .pr-svc-body h3 { font-family: var(--serif); font-size: 36px; font-weight: 400; letter-spacing: -0.015em; margin: 0 0 12px; grid-column: 1 / -1; }
  .pr-svc-body p { font-size: 15px; line-height: 1.7; color: var(--ink-soft); margin: 0; }
  .pr-svc-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .pr-svc-tags span { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; border: 1px solid var(--rule-strong); padding: 4px 10px; color: var(--ink-soft); }

  .pr-cta { padding: 120px 56px; background: var(--ink); color: var(--ivory); }
  .pr-cta-inner { max-width: 800px; margin: 0 auto; text-align: center; }
  .pr-cta-mark { font-family: var(--serif); font-style: italic; font-size: 80px; color: var(--gold-soft); line-height: 1; margin-bottom: 24px; }
  .pr-cta-h { font-family: var(--serif); font-size: clamp(44px, 5vw, 76px); font-weight: 400; line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 28px; }
  .pr-cta-h em { font-style: italic; color: var(--gold-soft); }
  .pr-cta-inner > p { font-size: 16px; line-height: 1.65; color: rgba(245,241,234,0.75); margin: 0 auto 36px; max-width: 560px; }
  .pr-cta-actions { display: flex; gap: 12px; justify-content: center; margin-bottom: 40px; }
  .pr-cta-foot { display: flex; gap: 12px; justify-content: center; font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; color: rgba(245,241,234,0.55); text-transform: uppercase; }

  /* === BOOKING MODAL === */
  .bk-overlay {
    position: fixed; inset: 0;
    background: rgba(14, 27, 44, 0.5);
    backdrop-filter: blur(8px);
    display: grid;
    place-items: center;
    z-index: 200;
    animation: bk-fade 240ms ease;
  }
  @keyframes bk-fade { from { opacity: 0; } to { opacity: 1; } }

  .bk-modal {
    width: min(880px, 92vw);
    max-height: 88vh;
    background: var(--paper);
    border-radius: 4px;
    box-shadow: 0 40px 100px rgba(14, 27, 44, 0.4);
    display: grid;
    grid-template-columns: 260px 1fr;
    overflow: hidden;
    animation: bk-slide 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  @keyframes bk-slide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .bk-side {
    background: var(--ink);
    color: var(--ivory);
    padding: 36px 28px;
    display: flex;
    flex-direction: column;
  }
  .bk-logo {
    font-family: var(--serif);
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 40px;
  }
  .bk-logo .mark {
    width: 24px; height: 24px;
    border: 1px solid currentColor;
    display: grid;
    place-items: center;
    font-style: italic;
    font-size: 12px;
  }
  .bk-steps { display: grid; gap: 20px; flex: 1; }
  .bk-step-item {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 14px;
    align-items: start;
    opacity: 0.5;
    transition: opacity 240ms;
  }
  .bk-step-item.active { opacity: 1; }
  .bk-step-item.done { opacity: 0.85; }
  .bk-step-num {
    width: 28px; height: 28px;
    border: 1px solid rgba(245,241,234,0.3);
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-family: var(--mono);
    font-size: 11px;
  }
  .bk-step-item.active .bk-step-num { border-color: var(--gold-soft); color: var(--gold-soft); }
  .bk-step-item.done .bk-step-num { background: var(--gold); border-color: var(--gold); color: var(--ink); }
  .bk-step-label { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(245,241,234,0.55); }
  .bk-step-title { font-size: 14px; font-weight: 500; margin-top: 2px; }
  .bk-side-foot { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(245,241,234,0.4); margin-top: auto; padding-top: 24px; }

  .bk-main {
    padding: 40px 48px;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .bk-close {
    position: absolute; top: 16px; right: 20px;
    width: 32px; height: 32px;
    display: grid; place-items: center;
    font-size: 20px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--ink-soft);
    border-radius: 50%;
    transition: background 200ms;
  }
  .bk-close:hover { background: var(--mist); }

  .bk-eyebrow { font-family: var(--mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }
  .bk-h { font-family: var(--serif); font-size: 32px; font-weight: 400; margin: 0 0 10px; letter-spacing: -0.015em; }
  .bk-sub { font-size: 14px; line-height: 1.6; color: var(--ink-soft); margin: 0 0 28px; }

  .bk-services { display: grid; gap: 10px; }
  .bk-service {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 16px 18px;
    border: 1px solid var(--rule);
    border-radius: 4px;
    cursor: pointer;
    background: transparent;
    text-align: left;
    transition: all 200ms;
  }
  .bk-service:hover { border-color: var(--ink); }
  .bk-service.selected { border-color: var(--gold); background: rgba(176,138,62,0.06); }
  .bk-service .name { font-size: 15px; font-weight: 500; margin-bottom: 4px; }
  .bk-service .desc { font-size: 13px; color: var(--ink-soft); }
  .bk-service .duration { font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em; color: var(--gold); white-space: nowrap; }

  .bk-date-simple { display: grid; gap: 20px; }
  .bk-date-input {
    padding: 12px 16px;
    border: 1px solid var(--rule-strong);
    border-radius: 4px;
    font-family: var(--sans);
    font-size: 14px;
    background: var(--ivory);
    color: var(--ink);
    max-width: 280px;
  }
  .bk-times { display: flex; flex-wrap: wrap; gap: 10px; }
  .bk-time {
    padding: 10px 16px;
    border: 1px solid var(--rule);
    border-radius: 4px;
    font-family: var(--mono);
    font-size: 13px;
    cursor: pointer;
    background: transparent;
    color: var(--ink);
    transition: all 200ms;
  }
  .bk-time:hover { border-color: var(--ink); }
  .bk-time.selected { background: var(--ink); color: var(--ivory); border-color: var(--ink); }

  .bk-form { display: grid; gap: 16px; }
  .bk-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .bk-field { display: grid; gap: 6px; }
  .bk-field label { font-size: 12px; font-weight: 500; letter-spacing: 0.04em; color: var(--ink-soft); text-transform: uppercase; font-family: var(--mono); }
  .bk-field input {
    padding: 12px 14px;
    border: 1px solid var(--rule-strong);
    border-radius: 4px;
    font-family: var(--sans);
    font-size: 14px;
    background: var(--ivory);
    color: var(--ink);
    outline: none;
    transition: border-color 200ms;
  }
  .bk-field input:focus { border-color: var(--gold); }

  .bk-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 28px;
    border-top: 1px solid var(--rule);
  }
  .bk-back {
    font-size: 13px;
    color: var(--ink-soft);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px 0;
    transition: color 200ms;
  }
  .bk-back:disabled { opacity: 0.3; cursor: default; }
  .bk-back:not(:disabled):hover { color: var(--ink); }

  .bk-success { text-align: center; padding: 40px 20px; }
  .bk-check { font-size: 48px; color: var(--gold); margin-bottom: 20px; }
  .bk-success h3 { font-family: var(--serif); font-size: 32px; font-weight: 400; margin: 0 0 12px; }
  .bk-success p { font-size: 15px; line-height: 1.6; color: var(--ink-soft); }
</style>
