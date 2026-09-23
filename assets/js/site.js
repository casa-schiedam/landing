/* ==========================================================================
   CASA — shared behaviour
   Nav, scroll reveals, FAQ, campaign band, and the booking/contact forms.
   Configuration lives in assets/js/config.js.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.CASA_CONFIG || {};

  // Fields carrying a given name. Compared directly rather than through a
  // selector, because prefill keys come from the URL and would need escaping.
  function namedFields(root, name) {
    return Array.prototype.filter.call(root.querySelectorAll('[name]'), function (el) {
      return el.getAttribute('name') === name;
    });
  }

  /* ── MOBILE NAV ────────────────────────────────────────────────────── */
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── MARK THE CURRENT PAGE IN THE NAV ──────────────────────────────── */
  // Scoped to top-level nav links only (.nav-links > li > a), so the three
  // links inside a submenu (About Raffa > Momo / Melting Pot / CASA) don't
  // all light up together just because they share about.html's filename.
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links > li > a[href]').forEach(function (a) {
    var target = a.getAttribute('href').split('#')[0].split('?')[0].toLowerCase();
    if (target && target === here) a.classList.add('is-current');
  });

  /* ── SCROLL REVEALS ────────────────────────────────────────────────── */
  var faders = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.05 });
    faders.forEach(function (el) { io.observe(el); });
  } else {
    faders.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── FAQ ACCORDION ─────────────────────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
        var btn = i.querySelector('.faq-q');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ── CAMPAIGN BAND ─────────────────────────────────────────────────── */
  var camp = CFG.campaign || {};
  if (camp.live === false) {
    document.querySelectorAll('[data-campaign-band]').forEach(function (el) { el.remove(); });
  } else {
    document.querySelectorAll('[data-campaign-url]').forEach(function (a) {
      if (camp.url) a.setAttribute('href', camp.url);
    });
    var fmt = function (n) { return '€' + Number(n || 0).toLocaleString('en-GB'); };
    var set = function (sel, val) {
      document.querySelectorAll(sel).forEach(function (el) { el.textContent = val; });
    };
    set('[data-campaign="raised"]', fmt(camp.raised));
    set('[data-campaign="goal"]', fmt(camp.goal));
    set('[data-campaign="supporters"]', String(camp.supporters != null ? camp.supporters : 0));
    set('[data-campaign="daysLeft"]', String(camp.daysLeft != null ? camp.daysLeft : '—'));

    var fill = document.querySelector('.progress-bar-fill');
    if (fill && camp.goal) {
      var pct = Math.max(0, Math.min(100, (camp.raised / camp.goal) * 100));
      setTimeout(function () { fill.style.width = pct + '%'; }, 400);
    }
  }

  /* ── CONTACT DETAILS FROM CONFIG ───────────────────────────────────── */
  document.querySelectorAll('[data-contact-email]').forEach(function (el) {
    el.textContent = CFG.contactEmail || '';
    if (el.tagName === 'A') el.setAttribute('href', 'mailto:' + CFG.contactEmail);
  });
  document.querySelectorAll('[data-contact-phone]').forEach(function (el) {
    if (!CFG.phone) { var w = el.closest('[data-optional]'); (w || el).remove(); return; }
    el.textContent = CFG.phone;
    if (el.tagName === 'A') el.setAttribute('href', 'tel:' + CFG.phone.replace(/[^+\d]/g, ''));
  });
  document.querySelectorAll('[data-contact-whatsapp]').forEach(function (el) {
    if (!CFG.whatsapp) { var w = el.closest('[data-optional]'); (w || el).remove(); return; }
    el.setAttribute('href', 'https://wa.me/' + CFG.whatsapp.replace(/\D/g, ''));
  });
  document.querySelectorAll('[data-contact-instagram]').forEach(function (el) {
    var handle = CFG.instagram || '';
    if (el.tagName === 'A') el.setAttribute('href', 'https://instagram.com/' + handle);
    if (el.hasAttribute('data-contact-instagram-text')) el.textContent = '@' + handle;
  });
  document.querySelectorAll('[data-reply-time]').forEach(function (el) {
    el.textContent = CFG.replyTime || 'as soon as possible';
  });

  /* ── PREFILL FIELDS FROM THE URL ───────────────────────────────────────
     Lets a "Book this" button carry its choice across, e.g.
     workshops.html?workshop=Fresh%20Pasta%20Lab#book
     Any query parameter matching a field's name pre-selects that field.   */
  var params = new URLSearchParams(location.search);
  if (params.toString()) {
    params.forEach(function (value, key) {
      namedFields(document, key).forEach(function (field) {
        if (field.tagName === 'SELECT') {
          var match = Array.prototype.find.call(field.options, function (o) {
            return o.value.toLowerCase() === value.toLowerCase();
          });
          if (match) field.value = match.value;
        } else if (field.type !== 'hidden' && field.type !== 'checkbox' && field.type !== 'radio') {
          field.value = value;
        }
      });
    });
  }

  /* ── SHOW TOPIC-SPECIFIC FIELDS (e.g. location/budget for Private events) ─
     A field marked data-show-for-topic="X" only makes sense when the
     form's subject_topic select is set to X. Runs once immediately (so it
     reflects a value that arrived pre-filled via the URL — the PREFILL
     block above sets .value directly, which fires no 'change' event) and
     again on every manual change.                                        */
  document.querySelectorAll('select[name="subject_topic"]').forEach(function (select) {
    var updateTopicFields = function () {
      document.querySelectorAll('[data-show-for-topic]').forEach(function (field) {
        field.classList.toggle('is-visible', field.getAttribute('data-show-for-topic') === select.value);
      });
    };
    select.addEventListener('change', updateTopicFields);
    updateTopicFields();
  });

  /* ── DATE FIELDS CANNOT BE IN THE PAST ─────────────────────────────── */
  var today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(function (d) {
    if (!d.min) d.min = today;
  });

  /* ── RETIRE EXPIRED DATED ITEMS ─────────────────────────────────────────
     Give ANY element a data-date="YYYY-MM-DD" (a .schedule-item on
     workshops.html/events.html, a .project-card on the home page, or
     anything else) and, the day after, this either:
     - moves it into the page's [data-schedule-past] list, if one exists —
       marked .schedule-item--past and stripped of its booking action (a
       past date can't be booked), most-recent-first; or
     - if the page has no past list (e.g. workshops.html's own schedule),
       removes it outright, same as before.
     An item already marked .schedule-item--past is left alone — it's
     meant to stay, as history.                                           */
  var pastList = document.querySelector('[data-schedule-past]');
  document.querySelectorAll('[data-date]').forEach(function (item) {
    if (item.classList.contains('schedule-item--past')) return;
    if (item.getAttribute('data-date') >= today) return;

    if (pastList) {
      item.classList.add('schedule-item--past');
      var action = item.querySelector('.schedule-item__action');
      if (action) action.remove();
      pastList.appendChild(item);
    } else {
      item.remove();
    }
  });

  // keep the past list sorted most-recent-first; items with no data-date
  // (added by hand, e.g. an old market with no exact date on record) are
  // left wherever they were placed in the markup.
  if (pastList) {
    var datedPast = Array.prototype.filter.call(pastList.children, function (el) {
      return el.hasAttribute('data-date');
    });
    datedPast.sort(function (a, b) {
      return b.getAttribute('data-date').localeCompare(a.getAttribute('data-date'));
    });
    datedPast.forEach(function (el) { pastList.appendChild(el); });
  }

  /* Keep each .schedule-list and its matching .schedule-empty[data-
     schedule-empty-for] (its next sibling) in sync both ways: empty list
     → hide the list, reveal the fallback; has items → the reverse. Both
     directions matter now that Jekyll pre-filters at build time — a list
     can start already empty in the rendered HTML (nothing was upcoming
     when the site last built) and then gain items right here, moments
     later, as the migration step above moves something into a past list. */
  document.querySelectorAll('.schedule-list').forEach(function (list) {
    var isEmpty = !list.querySelector('.schedule-item');
    list.style.display = isEmpty ? 'none' : '';
    var fallback = list.nextElementSibling;
    if (fallback && fallback.hasAttribute('data-schedule-empty-for')) fallback.hidden = !isEmpty;
  });

  /* ── FORMS ─────────────────────────────────────────────────────────── */

  // Pretty label for a field, for the plain-text email body.
  function labelFor(form, name) {
    var field = namedFields(form, name)[0];
    if (!field) return name;
    var lbl = field.closest('.field') ? field.closest('.field').querySelector('label') : null;
    return lbl ? lbl.textContent.replace('*', '').trim() : name;
  }

  function collect(form) {
    var data = {};
    new FormData(form).forEach(function (value, key) {
      if (key === 'casa_hp') return;                 // honeypot, never forwarded
      if (typeof value !== 'string') return;         // no file uploads on this site

      // A field hidden behind a data-show-for-topic toggle for a topic
      // other than the one currently selected (e.g. budget/location when
      // subject_topic isn't Private events) is skipped outright, even if
      // it carries a non-empty value (a <select> with a real default,
      // say) — CSS-hiding alone doesn't stop FormData from including it.
      var field = namedFields(form, key)[0];
      var wrapper = field && field.closest('[data-show-for-topic]');
      if (wrapper && !wrapper.classList.contains('is-visible')) return;

      var v = value.trim();
      if (!v) return;
      data[key] = data[key] ? data[key] + ', ' + v : v;
    });
    return data;
  }

  function asText(form, data) {
    return Object.keys(data).map(function (k) {
      return labelFor(form, k) + ': ' + data[k];
    }).join('\n');
  }

  function status(el, message, state) {
    el.textContent = message;
    el.className = 'form-status is-visible is-' + state;
  }

  function mailtoFallback(form, data, subject) {
    var body = asText(form, data) +
      '\n\n— sent from the CASA website (' + location.href.split('?')[0] + ')';
    var href = 'mailto:' + (CFG.contactEmail || '') +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    window.location.href = href;
  }

  function send(form, data, subject) {
    if (CFG.web3formsKey) {
      var payload = Object.assign({}, data, {
        access_key: CFG.web3formsKey,
        subject: subject,
        from_name: data.name || 'CASA website',
        botcheck: ''
      });
      if (data.email) payload.replyto = data.email;
      return fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        return r.json().then(function (j) {
          if (!r.ok || j.success === false) throw new Error(j.message || 'Web3Forms rejected the request');
          return j;
        });
      });
    }

    if (CFG.formspreeEndpoint) {
      var body = new FormData();
      Object.keys(data).forEach(function (k) { body.append(k, data[k]); });
      body.append('_subject', subject);
      if (data.email) body.append('_replyto', data.email);
      return fetch(CFG.formspreeEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: body
      }).then(function (r) {
        if (!r.ok) throw new Error('Formspree returned ' + r.status);
        return r.json();
      });
    }

    return Promise.reject({ noBackend: true });
  }

  document.querySelectorAll('form[data-casa-form]').forEach(function (form) {
    var statusEl = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    var buttonText = button ? button.textContent : 'Send';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.reportValidity()) return;

      // Honeypot: only a bot fills a field humans cannot see.
      var hp = form.querySelector('[name="casa_hp"]');
      if (hp && hp.value) {
        status(statusEl, 'Thank you — your request has been sent.', 'success');
        return;
      }

      var data = collect(form);
      var kind = form.getAttribute('data-casa-form');
      var subject = 'CASA — ' + kind + (data.name ? ' — ' + data.name : '');
      data.request_type = kind;

      if (button) { button.disabled = true; button.textContent = 'Sending…'; }
      status(statusEl, 'Sending your request…', 'pending');

      send(form, data, subject)
        .then(function () {
          form.reset();
          status(
            statusEl,
            'Thank you. Your request is on its way to Raffaella — she replies ' +
              (CFG.replyTime || 'as soon as possible') + '.',
            'success'
          );
        })
        .catch(function (err) {
          if (err && err.noBackend) {
            status(statusEl, 'Opening your email app so you can send this request…', 'pending');
            mailtoFallback(form, data, subject);
            return;
          }
          status(
            statusEl,
            'Something went wrong sending this. Please email ' +
              (CFG.contactEmail || 'us') + ' directly — sorry about that.',
            'error'
          );
        })
        .then(function () {
          if (button) { button.disabled = false; button.textContent = buttonText; }
        });
    });
  });

  /* ── FOOTER YEAR ───────────────────────────────────────────────────── */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
