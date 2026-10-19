<script lang="ts">
  // Ported from Claude Design project "Defense Law Firm Template" (Midnight & Brass).
  // Credentials, results and reviews render only when the content supplies them, so a
  // derived prospect site never shows an invented claim.

  import type { DefenseContent } from './types';

  let { content }: { content: DefenseContent } = $props();

  const icons = {
    phone:
      'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z'
  };

  const charges = [
    { name: 'DUI / DWI', line: 'Impaired-driving arrests, license suspensions and court deadlines.' },
    { name: 'Drug Crimes', line: 'Possession, distribution and paraphernalia charges.' },
    { name: 'Assault & Domestic Violence', line: 'Accusations of physical harm, often with protective orders.' },
    { name: 'Theft & Shoplifting', line: 'Misdemeanor and felony theft, burglary and fraud.' },
    { name: 'Sex Crimes', line: 'Discreet, careful defense for serious allegations.' },
    { name: 'Weapons', line: 'Firearm possession and carry charges.' },
    { name: 'Probation Violation', line: 'Missed check-ins, new arrests or failed tests.' },
    { name: 'Warrants', line: 'Resolve an active warrant on your terms.' },
    { name: 'Juvenile', line: 'Protecting a young person’s record and future.' },
    { name: 'Expungement & Record Sealing', line: 'Clear eligible records that hold you back.' },
    { name: 'White-Collar', line: 'Fraud, embezzlement and financial investigations.' },
    { name: 'Federal Charges', line: 'Federal court defense and investigations.' }
  ];

  const steps = [
    { n: 1, title: 'Call or text, 24/7', body: 'Nights, weekends and holidays. A person answers, not a menu.' },
    {
      n: 2,
      title: 'Free, confidential case review',
      body: 'We explain the charge, the possible penalties and your options.'
    },
    { n: 3, title: 'A clear quote and a plan', body: 'You’ll know the cost before we start, and what comes next.' }
  ];

  const faqs = $derived([
    {
      q: 'Is the consultation really free and confidential?',
      a: 'Yes. Your first call or meeting is free, and what you tell us in seeking legal help is generally kept confidential.'
    },
    {
      q: 'Should I talk to the police?',
      a: 'In many cases it is wise to say politely that you want a lawyer and then call one before answering questions. What is best depends on your situation.'
    },
    {
      q: 'What happens at my first court date?',
      a: 'It is often a short hearing where the charges are read and next dates may be set. A lawyer can often appear with you and explain each step.'
    },
    {
      q: 'Can charges be dropped?',
      a: 'Sometimes. Charges may be reduced or dismissed depending on the evidence, the law and the facts. No lawyer can promise an outcome.'
    },
    {
      q: 'How much does a defense lawyer cost?',
      a: `It depends on the charge and the court. ${content.feeModel}, and you will know the cost before we start.`
    },
    {
      q: 'Can my record be expunged?',
      a: `In many cases it may be, depending on the offense, how much time has passed and the law. We can review your eligibility. We serve ${content.faqAreasAnswer}`
    }
  ]);

  const emptyForm = { name: '', phone: '', time: '', charge: '', who: 'Me', sms: false };
  type Errors = { name?: boolean; phone?: boolean };

  let form = $state({ ...emptyForm });
  let errs = $state<Errors>({});
  let tried = $state(false);
  let submitted = $state(false);

  const firstName = $derived(form.name.trim().split(' ')[0]);

  function validate(f: typeof emptyForm): Errors {
    return { name: !f.name.trim(), phone: f.phone.replace(/\D/g, '').length < 7 };
  }
  function revalidate() {
    if (tried) errs = validate(form);
  }
  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    errs = validate(form);
    tried = true;
    submitted = !Object.values(errs).some(Boolean);
  }
  function resetForm() {
    submitted = false;
    tried = false;
    errs = {};
    form = { ...emptyForm };
  }
</script>

<svelte:head>
  <title>{content.title}</title>
  <meta name="description" content={content.metaDescription} />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600&family=Manrope:wght@400;500;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="df-root">
  <a href="#main" class="skip">Skip to content</a>

  <div class="bar">
    <div class="wrap bar-in">
      <span>Available 24/7 · Nights, weekends &amp; holidays</span>
      <span class="wide">Free, confidential consultation</span>
      <span
        >Call or text <a href={content.phoneHref}><b>{content.phoneDisplay}</b></a> ·
        <a href={content.textHref}><b>Text</b></a></span
      >
    </div>
  </div>

  <header class="head">
    <div class="wrap head-in">
      <a href="#top" class="brand">
        <span class="mono" aria-hidden="true">{content.monogram}</span>
        <span class="brand-name">{content.firmName}</span>
      </a>
      <nav class="nav" aria-label="Primary">
        <a href="#charges">Charges We Defend</a>
        <a href="#process">How it works</a>
        {#if content.results.length}<a href="#results">Results</a>{/if}
        {#if content.reviews.length}<a href="#reviews">Reviews</a>{/if}
        <a href="#fees">Fees</a>
        <a href="#faq">FAQ</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="head-cta">
        <a href={content.phoneHref} class="head-phone"
          ><small>24/7</small><span>{content.phoneDisplay}</span></a
        >
        <a href="#contact" class="btn btn-a wide">Free Consultation</a>
      </div>
    </div>
  </header>

  <main id="main">
    <section class="hero" id="top">
      <div class="wrap hero-in">
        <p class="eyebrow">{content.city} Criminal Defense Lawyer</p>
        <h1>{content.heroHeadline}</h1>
        <p class="lead">
          The sooner you have a lawyer, the more options you have. Free, confidential, and no judgment.
        </p>
        <div class="btn-row">
          <a class="btn btn-a" href={content.phoneHref}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
              ><path d={icons.phone} /></svg
            >
            Call {content.phoneDisplay} — 24/7
          </a>
          <a class="btn btn-o" href={content.textHref}>Text Us</a>
          <a class="btn btn-o" href="#contact">Request a Free Consultation</a>
        </div>
        <p class="note">Free, confidential consultation. No obligation.</p>
        {#if content.proof}
          <p class="proof">
            {content.proof.years} years · {content.proof.formerRole} · ★ {content.proof.rating} ({content.proof.reviewCount}
            reviews)
          </p>
        {/if}
      </div>
    </section>

    <section class="now">
      <div class="wrap">
        <p>
          <strong>Been arrested or contacted by police?</strong> Don’t discuss your case with anyone,
          including on the phone from jail or on social media. Politely say you want a lawyer, then call
          us at <a href={content.phoneHref}><b>{content.phoneDisplay}</b></a>.
          <span class="disc">General information, not legal advice.</span>
        </p>
      </div>
    </section>

    {#if content.credentials}
      <section class="creds">
        <div class="wrap creds-in">
          <div><h2 class="cl">Admitted to</h2><p>{content.credentials.barAdmissions}</p></div>
          <div><h2 class="cl">Memberships</h2><p>{content.credentials.memberships}</p></div>
          <div><h2 class="cl">Languages</h2><p>{content.credentials.languages}</p></div>
        </div>
      </section>
    {/if}

    <section class="sec" id="charges">
      <div class="wrap">
        <p class="eyebrow">Charges we defend</p>
        <h2>Find your charge. Know your options.</h2>
        <ul class="tiles">
          {#each charges as c (c.name)}
            <li>
              <a class="tile" href="#contact">
                <h3>{c.name}</h3>
                <span>{c.line}</span>
                <b>Ask about this charge →</b>
              </a>
            </li>
          {/each}
        </ul>
        <div class="btn-row">
          <a class="btn btn-a" href={content.phoneHref}>Call {content.phoneDisplay} — 24/7</a>
          <span class="disc">Free, confidential consultation.</span>
        </div>
      </div>
    </section>

    <section class="sec alt" id="process">
      <div class="wrap">
        <p class="eyebrow">What happens next</p>
        <h2>Three steps. No surprises.</h2>
        <ol class="steps">
          {#each steps as s (s.n)}
            <li><span class="n">{s.n}</span><h3>{s.title}</h3><p>{s.body}</p></li>
          {/each}
        </ol>
        <p class="strong">No pressure. If we’re not the right fit, we’ll tell you.</p>
      </div>
    </section>

    {#if content.results.length}
      <section class="sec" id="results">
        <div class="wrap">
          <p class="eyebrow">Case results</p>
          <h2>Outcomes in real cases.</h2>
          <p class="callout">
            Prior results do not guarantee a similar outcome. Every case is different and depends on its
            facts.
          </p>
          <ul class="cards">
            {#each content.results as r (r.charge + r.county)}
              <li class="card">
                <p class="eyebrow">{r.county}</p>
                <h3>{r.charge} → <span class="ok">{r.outcome}</span></h3>
                <p>{r.summary}</p>
              </li>
            {/each}
          </ul>
        </div>
      </section>
    {/if}

    {#if content.reviews.length}
      <section class="sec alt" id="reviews">
        <div class="wrap">
          <p class="eyebrow">Reviews</p>
          <h2>What clients say.</h2>
          <ul class="cards">
            {#each content.reviews as r (r.attribution + r.quote)}
              <li class="card"><blockquote>“{r.quote}”</blockquote><p class="disc">— {r.attribution}</p></li>
            {/each}
          </ul>
          <p class="disc">
            Testimonials reflect individual experiences. Prior results do not guarantee a similar
            outcome.
          </p>
        </div>
      </section>
    {/if}

    <section class="sec" id="fees">
      <div class="wrap two">
        <div>
          <p class="eyebrow">Fees &amp; payment</p>
          <h2>You’ll know the cost before we start.</h2>
          <p class="muted">
            Cost depends on the charge, the court and the work involved. We explain it in plain English on
            your free consultation.
          </p>
        </div>
        <div class="card">
          <p class="fee">{content.feeModel}.</p>
          <ul class="plain">
            <li>Payment plans available</li>
            <li>Major cards accepted</li>
            <li>Free, confidential first consultation</li>
          </ul>
        </div>
      </div>
    </section>

    {#if content.areas.length}
      <section class="sec alt" id="areas">
        <div class="wrap">
          <p class="eyebrow">Areas served</p>
          <h2>Local counsel in {content.city} and nearby.</h2>
          <ul class="chips">
            {#each content.areas as a (a)}<li>{a}</li>{/each}
          </ul>
          {#if content.address}
            <address>
              {#each content.address as line (line)}{line}<br />{/each}
            </address>
          {/if}
        </div>
      </section>
    {/if}

    <section class="sec" id="faq">
      <div class="wrap narrow">
        <p class="eyebrow">Questions</p>
        <h2>Common questions, general answers.</h2>
        <div class="faqs">
          {#each faqs as f (f.q)}
            <details><summary>{f.q}</summary><p>{f.a}</p></details>
          {/each}
        </div>
      </div>
    </section>

    <section class="contact" id="contact">
      <div class="wrap two">
        <div>
          <p class="eyebrow">Free, confidential consultation</p>
          <h2>Call or text, any hour.</h2>
          <a href={content.phoneHref} class="big-phone">{content.phoneDisplay}</a>
          <ul class="plain light">
            <li>Confidential. We never share what you tell us.</li>
            <li>Direct access to your attorney.</li>
            <li>Clear cost before we start.</li>
          </ul>
        </div>
        <form class="form" onsubmit={handleSubmit} novalidate>
          {#if submitted}
            <div class="thanks" role="status">
              <p class="thanks-head">Thank you{firstName ? `, ${firstName}` : ''}.</p>
              <p>We’ll call you at {form.phone} to discuss confidentially. If it’s urgent, call now.</p>
              <a href={content.phoneHref} class="btn btn-a">Call {content.phoneDisplay}</a>
              <button type="button" class="link" onclick={resetForm}>Send another request</button>
            </div>
          {:else}
            <label
              >Your name
              <input
                name="name"
                autocomplete="name"
                bind:value={form.name}
                oninput={revalidate}
                aria-invalid={errs.name ? 'true' : undefined}
              />
              {#if errs.name}<span class="err">Please enter your name.</span>{/if}
            </label>
            <label
              >Phone
              <input
                name="phone"
                type="tel"
                autocomplete="tel"
                inputmode="tel"
                bind:value={form.phone}
                oninput={revalidate}
                aria-invalid={errs.phone ? 'true' : undefined}
              />
              {#if errs.phone}<span class="err">Please enter a phone number.</span>{/if}
            </label>
            <label>Best time to call <input name="time" bind:value={form.time} /></label>
            <label
              >Charge type
              <select name="charge" bind:value={form.charge}>
                <option value="">Not sure</option>
                {#each charges as c (c.name)}<option>{c.name}</option>{/each}
              </select>
            </label>
            <label
              >Who is this for?
              <select name="who" bind:value={form.who}>
                <option>Me</option>
                <option>A loved one</option>
              </select>
            </label>
            <p class="fine">
              Please don’t include detailed facts about your case here. Submitting this form does not
              create an attorney-client relationship. We’ll call you to discuss confidentially.
            </p>
            <label class="check"
              ><input type="checkbox" name="sms" bind:checked={form.sms} /> I agree to receive text messages
              about my inquiry. Message and data rates may apply.</label
            >
            <button class="btn btn-a" type="submit">Request my free consultation</button>
          {/if}
        </form>
      </div>
    </section>

    <section class="closing">
      <div class="wrap">
        <h2>Your future is worth a phone call.</h2>
        <div class="btn-row center">
          <a class="btn btn-a" href={content.phoneHref}>Call {content.phoneDisplay} — 24/7</a>
          <a class="btn btn-od" href={content.textHref}>Text Us</a>
        </div>
        <p class="small">Free, confidential consultation.</p>
      </div>
    </section>
  </main>

  <footer class="foot">
    <div class="wrap">
      <address>
        <strong>{content.firmName}</strong><br />
        {content.servingLine}<br />
        <a href={content.phoneHref}>{content.phoneDisplay}</a>
      </address>
      <p class="legal">
        <strong>Attorney Advertising.</strong> The information on this website is for general information
        only and is not legal advice. Use of this site or contacting us does not create an attorney-client
        relationship. Prior results do not guarantee a similar outcome. {content.responsibleAttorney} is responsible
        for this website’s content.
      </p>
      <p class="legal">{content.copyrightLine}</p>
    </div>
  </footer>

  <div class="mbar" aria-label="Quick contact">
    <a class="btn btn-a" href={content.phoneHref} style="flex:2">Call 24/7</a>
    <a class="btn btn-od" href={content.textHref} style="flex:1">Text</a>
    <a class="btn btn-od" href="#contact" style="flex:1.3">Free Consult</a>
  </div>
</div>

<style>
  .df-root {
    --color-primary: #14233c;
    --color-dark: #0b1422;
    --color-accent: #8f5a14;
    --color-brass: #c9a15a;
    --color-bg: #faf9f6;
    --color-bg-alt: #f1eee8;
    --color-text: #151b26;
    --color-muted: #4a5262;
    --radius: 10px;
    font-family: Manrope, system-ui, sans-serif;
    font-size: 17px;
    line-height: 1.65;
    color: var(--color-text);
    background: var(--color-bg);
    cursor: auto;
  }
  .df-root :global(*) {
    cursor: auto;
  }
  .df-root :global(a),
  .df-root :global(button),
  .df-root :global(summary),
  .df-root :global(select) {
    cursor: pointer;
  }
  h1,
  h2,
  h3 {
    font-family: Fraunces, Georgia, serif;
    font-weight: 600;
    line-height: 1.15;
    margin: 0;
    color: var(--color-primary);
  }
  p {
    margin: 0;
  }
  a {
    color: inherit;
  }
  .wrap {
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 24px;
    box-sizing: border-box;
  }
  .narrow {
    max-width: 820px;
  }
  .skip {
    position: absolute;
    left: -9999px;
  }
  .skip:focus {
    left: 8px;
    top: 8px;
    background: #fff;
    padding: 8px 12px;
    z-index: 50;
  }
  :focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }
  .bar {
    background: var(--color-dark);
    color: #fff;
    font-size: 14px;
  }
  .bar-in {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 4px 24px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .head {
    position: sticky;
    top: 0;
    z-index: 20;
    background: var(--color-bg);
    border-bottom: 1px solid #e3dfd6;
  }
  .head-in {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    min-height: 76px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
  }
  .mono {
    width: 42px;
    height: 42px;
    border-radius: 8px;
    background: var(--color-primary);
    color: var(--color-brass);
    font-family: Fraunces, serif;
    font-weight: 600;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .brand-name {
    font-family: Fraunces, serif;
    font-weight: 600;
    font-size: 20px;
    color: var(--color-primary);
  }
  .nav {
    display: flex;
    gap: 22px;
  }
  .nav a {
    white-space: nowrap;
    text-decoration: none;
    font-weight: 500;
    font-size: 15px;
  }
  .head-cta {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .head-phone {
    white-space: nowrap;
    text-decoration: none;
    line-height: 1.2;
    text-align: right;
  }
  .head-phone small {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--color-muted);
  }
  .head-phone span {
    font-family: Fraunces, serif;
    font-weight: 600;
    font-size: 22px;
    color: var(--color-primary);
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 50px;
    padding: 0 24px;
    border-radius: var(--radius);
    font: 700 16px Manrope, sans-serif;
    text-decoration: none;
    box-sizing: border-box;
    border: 2px solid transparent;
  }
  .btn-a {
    background: var(--color-accent);
    color: #fff;
  }
  .btn-o {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: transparent;
  }
  .btn-od {
    border-color: rgba(255, 255, 255, 0.7);
    color: #fff;
  }
  .btn-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    margin-top: 28px;
  }
  .btn-row.center {
    justify-content: center;
  }
  .eyebrow {
    font-size: 13px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--color-accent);
  }
  .disc,
  .note,
  .small {
    font-size: 14px;
    line-height: 1.55;
    color: var(--color-muted);
  }
  .hero-in {
    padding-top: 72px;
    padding-bottom: 72px;
    max-width: 920px;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }
  .hero h1 {
    font-size: 56px;
    letter-spacing: -0.01em;
  }
  .lead {
    font-size: 20px;
    color: var(--color-muted);
    max-width: 580px;
  }
  .hero .btn-row {
    margin-top: 0;
  }
  .proof {
    font-size: 15px;
    font-weight: 700;
    color: var(--color-primary);
    border-top: 1px solid #d9d4c8;
    padding-top: 16px;
  }
  .now {
    background: var(--color-bg-alt);
    border-top: 1px solid #e3dfd6;
    border-bottom: 1px solid #e3dfd6;
    padding: 22px 0;
    border-left: 6px solid var(--color-accent);
  }
  .now strong {
    color: var(--color-primary);
  }
  .creds {
    background: var(--color-dark);
    color: #fff;
  }
  .creds-in {
    display: flex;
    flex-wrap: wrap;
    gap: 20px 40px;
    padding-top: 32px;
    padding-bottom: 32px;
  }
  .creds-in > div {
    flex: 1 1 200px;
    font-size: 15px;
  }
  .cl {
    font: 700 13px Manrope, sans-serif;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-brass);
  }
  .sec {
    padding: 84px 0;
  }
  .sec.alt {
    background: var(--color-bg-alt);
  }
  .sec h2,
  .contact h2,
  .closing h2 {
    font-size: 40px;
    margin: 12px 0 28px;
  }
  .tiles,
  .cards {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .tiles li {
    flex: 1 1 250px;
    max-width: calc(25% - 15px);
    min-width: 230px;
  }
  .tile {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px;
    height: 100%;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #e3dfd6;
    border-radius: var(--radius);
    text-decoration: none;
  }
  .tile h3 {
    font-size: 20px;
  }
  .tile span {
    font-size: 15px;
    color: var(--color-muted);
  }
  .tile b {
    font-size: 14px;
    color: var(--color-accent);
  }
  .steps {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .steps li,
  .card {
    flex: 1 1 280px;
    background: #fff;
    border: 1px solid #e3dfd6;
    border-radius: var(--radius);
    padding: 26px;
    box-sizing: border-box;
  }
  .n {
    display: block;
    font: 600 44px Fraunces, serif;
    color: var(--color-accent);
  }
  .steps h3 {
    font-size: 22px;
    margin: 6px 0 8px;
  }
  .steps p,
  .muted,
  .card p {
    color: var(--color-muted);
  }
  .strong {
    margin-top: 28px;
    font-weight: 700;
    color: var(--color-primary);
  }
  .callout {
    margin-bottom: 28px;
    padding: 14px 18px;
    background: #fff;
    border: 1px solid #d9d4c8;
    border-radius: var(--radius);
    font-weight: 700;
    color: var(--color-primary);
  }
  .card h3 {
    font-size: 22px;
  }
  .ok {
    color: #15803d;
  }
  blockquote {
    margin: 0 0 12px;
  }
  .two {
    display: flex;
    flex-wrap: wrap;
    gap: 48px;
  }
  .two > div,
  .two > form {
    flex: 1 1 420px;
  }
  .fee {
    font: 600 24px Fraunces, serif;
    color: var(--color-primary);
  }
  .plain {
    margin: 12px 0 0;
    padding-left: 20px;
    color: var(--color-muted);
  }
  .plain.light {
    color: rgba(255, 255, 255, 0.85);
  }
  .chips {
    list-style: none;
    margin: 0 0 20px;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .chips li {
    padding: 8px 16px;
    border: 1px solid #cfc9ba;
    border-radius: 999px;
    font-size: 15px;
    background: #fff;
  }
  address {
    font-style: normal;
    color: var(--color-muted);
  }
  details {
    border-top: 1px solid #d9d4c8;
    padding: 14px 0;
  }
  details:last-child {
    border-bottom: 1px solid #d9d4c8;
  }
  summary {
    font-weight: 700;
    color: var(--color-primary);
    min-height: 44px;
    display: flex;
    align-items: center;
  }
  details p {
    color: var(--color-muted);
  }
  .contact {
    background: var(--color-dark);
    color: #fff;
    padding: 84px 0;
  }
  .contact h2 {
    color: #fff;
  }
  .contact .eyebrow {
    color: var(--color-brass);
  }
  .big-phone {
    display: block;
    font: 600 40px Fraunces, serif;
    color: #fff;
    text-decoration: none;
    margin-bottom: 18px;
  }
  .form {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: var(--radius);
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    box-sizing: border-box;
  }
  .form label {
    display: block;
    font-size: 14px;
    font-weight: 700;
  }
  .form input:not([type='checkbox']),
  .form select {
    display: block;
    width: 100%;
    box-sizing: border-box;
    min-height: 48px;
    margin-top: 4px;
    border-radius: 8px;
    border: 1px solid #8892a3;
    padding: 10px 12px;
    font: 400 16px Manrope, sans-serif;
    background: #fff;
    color: var(--color-text);
  }
  .form .check {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    font-weight: 400;
  }
  .form .check input {
    width: 22px;
    height: 22px;
    margin: 2px 0 0;
  }
  .fine {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
  }
  .err {
    display: block;
    color: #fecaca;
    font-weight: 400;
    margin-top: 4px;
  }
  .thanks {
    display: flex;
    flex-direction: column;
    gap: 14px;
    align-items: flex-start;
  }
  .thanks-head {
    font: 600 26px Fraunces, serif;
  }
  .link {
    background: none;
    border: 0;
    padding: 0;
    color: #fff;
    text-decoration: underline;
    font: inherit;
  }
  .closing {
    background: var(--color-primary);
    color: #fff;
    text-align: center;
    padding: 64px 0;
  }
  .closing h2 {
    color: #fff;
    margin: 0 0 8px;
  }
  .closing .small {
    margin-top: 16px;
    color: rgba(255, 255, 255, 0.85);
  }
  .foot {
    background: var(--color-dark);
    color: rgba(255, 255, 255, 0.85);
    padding: 48px 0 40px;
    font-size: 14px;
  }
  .foot strong {
    color: #fff;
  }
  .foot address {
    color: inherit;
    margin-bottom: 18px;
  }
  .legal {
    line-height: 1.7;
    margin-top: 8px;
  }
  .mbar {
    display: none;
  }
  @media (max-width: 1099px) {
    .nav {
      display: none;
    }
  }
  @media (max-width: 899px) {
    .wide {
      display: none;
    }
    .hero h1 {
      font-size: 38px;
    }
    .sec,
    .contact {
      padding: 56px 0;
    }
    .sec h2,
    .contact h2 {
      font-size: 30px;
    }
    .tiles li {
      max-width: none;
    }
    .df-root {
      padding-bottom: 72px;
    }
    .mbar {
      display: flex;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      gap: 8px;
      padding: 10px 12px;
      background: var(--color-dark);
      z-index: 30;
    }
  }
</style>
