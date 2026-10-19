/* ==========================================================================
   {{FIRM_NAME}} — main.js
   Progressive enhancement only. Every page works with JS disabled:
   - the mobile menu falls back to a stacked nav (<noscript> block in <head>)
   - the pricing toggle is a real radio group switched by CSS :has()
   - the consult form posts normally to {{FORM_ENDPOINT}}
   ========================================================================== */
(function () {
  'use strict';

  /* ---- 1. Mobile menu ---------------------------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close on Escape, return focus to the toggle.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });

    // Close when a link inside is followed (same-page anchors included).
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && window.innerWidth < 900) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- 2. Dropdown toggles (hover/focus also works without JS) ----------- */
  var subToggles = document.querySelectorAll('.sub-toggle');
  Array.prototype.forEach.call(subToggles, function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      Array.prototype.forEach.call(subToggles, function (other) {
        if (other !== btn) other.setAttribute('aria-expanded', 'false');
      });
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) {
      Array.prototype.forEach.call(subToggles, function (btn) {
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  /* ---- 3. Header shadow on scroll --------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- 4. Pricing toggle: announce the change (CSS does the switching) --- */
  var billing = document.querySelectorAll('input[name="billing"]');
  var billingStatus = document.getElementById('billing-status');
  Array.prototype.forEach.call(billing, function (radio) {
    radio.addEventListener('change', function () {
      if (!radio.checked || !billingStatus) return;
      billingStatus.textContent = radio.value === 'annual'
        ? 'Showing annual prices.'
        : 'Showing monthly prices.';
    });
  });

  /* ---- 5. Form validation ----------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('form[data-validate]'), function (form) {
    var status = form.querySelector('.form-status');

    var setError = function (field, message) {
      var holder = field.closest('.field') || field.parentNode;
      var existing = holder.querySelector('.error-text');
      if (message) {
        field.setAttribute('aria-invalid', 'true');
        if (!existing) {
          var span = document.createElement('span');
          span.className = 'error-text';
          span.id = field.id + '-error';
          span.textContent = message;
          holder.appendChild(span);
          field.setAttribute('aria-describedby',
            (field.getAttribute('aria-describedby') ? field.getAttribute('aria-describedby') + ' ' : '') + span.id);
        } else {
          existing.textContent = message;
        }
      } else {
        field.removeAttribute('aria-invalid');
        if (existing) existing.remove();
      }
    };

    var validateField = function (field) {
      var value = (field.value || '').trim();
      if (field.hasAttribute('required') && !value) {
        setError(field, 'Please fill this in.');
        return false;
      }
      if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        setError(field, 'Please enter a valid email address.');
        return false;
      }
      if (field.type === 'tel' && value && value.replace(/[^\d]/g, '').length < 10) {
        setError(field, 'Please enter a 10-digit phone number.');
        return false;
      }
      setError(field, '');
      return true;
    };

    form.addEventListener('submit', function (e) {
      var fields = form.querySelectorAll('input[required], input[type="email"], input[type="tel"], select[required], textarea[required]');
      var firstBad = null;

      Array.prototype.forEach.call(fields, function (field) {
        if (!validateField(field) && !firstBad) firstBad = field;
      });

      // Honeypot: a filled hidden field means a bot. Fail silently.
      var hp = form.querySelector('input[name="company_website"]');
      if (hp && hp.value) { e.preventDefault(); return; }

      if (firstBad) {
        e.preventDefault();
        if (status) {
          status.className = 'form-status is-error';
          status.textContent = 'Please check the highlighted fields.';
        }
        firstBad.focus();
        return;
      }

      // No endpoint wired up yet? Keep the visitor on the page and say so.
      var action = form.getAttribute('action') || '';
      if (!action || action.indexOf('{{') === 0) {
        e.preventDefault();
        if (status) {
          status.className = 'form-status is-error';
          status.textContent = 'This form is not connected yet. Please call us or book a time online.';
        }
        return;
      }

      if (status) {
        status.className = 'form-status is-success';
        status.textContent = 'Sending…';
      }
    });

    Array.prototype.forEach.call(form.querySelectorAll('input, select, textarea'), function (field) {
      field.addEventListener('blur', function () {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });
  });

  /* ---- 6. Booking embed: load only on click (keeps CLS at 0) ------------- */
  var embedButton = document.querySelector('[data-booking-embed]');
  if (embedButton) {
    embedButton.addEventListener('click', function (e) {
      var url = embedButton.getAttribute('data-booking-embed');
      // Leave the token in place until the real URL is pasted in.
      if (!url || url.indexOf('{{') === 0) return;
      e.preventDefault();
      var slot = document.getElementById('booking-embed-slot');
      if (!slot || slot.dataset.loaded === 'true') return;
      var frame = document.createElement('iframe');
      frame.src = url;
      frame.title = 'Book a consultation';
      frame.loading = 'lazy';
      frame.width = '100%';
      frame.height = '640';
      frame.style.border = '0';
      slot.textContent = '';
      slot.appendChild(frame);
      slot.dataset.loaded = 'true';
    });
  }
}());
