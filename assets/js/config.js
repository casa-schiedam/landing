/* ==========================================================================
   CASA — site configuration
   --------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO MAKE THE FORMS WORK.

   Every booking / catering / contact form on the site posts through here.
   Until you fill in a key below, forms fall back to opening the visitor's
   email app with the request pre-written. That works, but you will lose
   the people who have no mail app set up — so set one of these up.

   ── OPTION A — Web3Forms (recommended: free, no account, 2 minutes) ────────
   1. Go to https://web3forms.com
   2. Type the address where Raffa should receive requests -> get an Access Key
   3. Paste that key below as `web3formsKey`
   Done. Requests arrive as email, 250/month on the free plan.

   ── OPTION B — Formspree ──────────────────────────────────────────────────
   1. Create a free account at https://formspree.io and create one form
   2. Copy its endpoint (looks like https://formspree.io/f/abcdwxyz)
   3. Paste it below as `formspreeEndpoint`
   (If both are filled in, Web3Forms wins.)
   ========================================================================== */

window.CASA_CONFIG = {
  // --- Form delivery (fill ONE of these two) ---
  web3formsKey: '',
  formspreeEndpoint: '',

  // --- Where requests go, and how people reach Raffa directly ---
  contactEmail: 'info@casa-schiedam.nl',
  phone: '',                       // e.g. '+31 6 12 34 56 78' — leave '' to hide it
  whatsapp: '',                    // e.g. '31612345678' (digits only) — leave '' to hide it
  instagram: 'casa.schiedam',
  city: 'Schiedam, The Netherlands',

  // --- Crowdfunding campaign (secondary; shown in the support band) ---
  campaign: {
    live: true,                    // set to false to hide the campaign band everywhere
    url: '#',                      // paste the Ulule campaign URL here
    raised: 0,
    goal: 40000,
    supporters: 0,
    daysLeft: 28
  },

  // --- How long people should expect to wait for a reply ---
  replyTime: 'within 2 working days'
};
