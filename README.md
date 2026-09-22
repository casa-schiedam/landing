# CASA — website

Website for Raffaella / CASA (Schiedam, NL): catering, cooking
workshops & lessons, and private events, plus the crowdfunding campaign for
a permanent space. No build step, no framework — plain HTML, one stylesheet,
two small scripts. Deploys to GitHub Pages automatically on every push to
`main` (`.github/workflows/static.yml`).

## Before it goes live — three things

### 1. Make the contact form actually deliver (required)

Every booking and enquiry on the site funnels into **one form on `contact.html`**,
which posts through `assets/js/config.js`. **Until you set a key there, the form
falls back to opening the visitor's email app** with the request pre-written —
that works, but you lose anyone without a mail client set up.

1. Go to <https://web3forms.com>
2. Enter the address where Raffa should receive requests → you get an Access Key
3. Put it in `assets/js/config.js`:

```js
web3formsKey: 'paste-the-key-here',
```

That's it. Requests arrive as email (250/month free). Formspree is supported as
an alternative — see the comments in that file.

### 2. Fill in the real details

Also in `assets/js/config.js`: `contactEmail`, `phone`, `whatsapp` (leave `''`
and the row disappears by itself), `instagram`, the Ulule `campaign.url`, and
`replyTime`.

### 3. Fill in content marked "Raffa —"

Search the site for `needs-content` — every block flagged that way is a
placeholder I couldn't fill in honestly, not real information:

```bash
grep -rln "needs-content" *.html
```

That includes:
- **`about.html`** — real numbers for "Experience" (years cooking, roughly how
  many workshops/events so far); and for the **Melting Pot** project card,
  confirmation that **Ferm** is a real second venue (only Rose Molen in Delft
  is confirmed) and how often it actually runs.
- **`private-events.html`** — minimum group size for a small aperitivo / lunch / dinner.
- **`workshops.html`** and **`events.html`** — list the two real dates for
  "Pasta Making with Raffa & Vale" at Rose Molen, Delft (10 Oct and 15 Nov
  2026, sourced from [Bij de Roos's booking page](https://bijderoos.nl/webshop/pasta-making-with-rafa-and-vale/)).
  Both link out to that page since booking happens there, not on this site.
  Past events are still an honest empty state — add real ones as they happen.

Workshop/private-event/catering **durations and group sizes** in the listing
pages are reasonable-sounding placeholders too, not confirmed numbers — check
them. The four photos on `events.html`'s "Hosting & managing events" cards
(weddings / tastings / product launches / other) are generic food shots, not
photos from real past events of that kind — swap them for real ones if you have them.

## Adding an event or workshop date

`workshops.html` (upcoming workshops) and `events.html` (public appearances)
both use a `.schedule-item` block:

```html
<div class="schedule-item">
  <div class="schedule-item__date"><span class="day">14</span><span class="month">Mar</span></div>
  <div class="schedule-item__body">
    <div class="schedule-item__tags"><span class="tag">Fresh pasta</span></div>
    <h3 class="schedule-item__name">Fresh Pasta Lab</h3>
    <p class="schedule-item__place">📍 Partner kitchen, Schiedam</p>
  </div>
  <div class="schedule-item__action">
    <a class="btn-ghost" href="contact.html?subject_topic=Workshops%20%26%20cooking%20lessons&amp;detail=Fresh%20Pasta%20Lab%20%E2%80%94%2014%20Mar">Reserve a seat</a>
  </div>
</div>
```

Copy one, edit the date/tag/name/place, and make the `detail=` value in the
link unique so replies coming back say which date someone means. Add the
class `schedule-item--past` to move something into a "past" list.

**Expired dates hide themselves — anywhere on the site, not just in a list.**
Give any element a `data-date="YYYY-MM-DD"` attribute and it removes itself
the day after, with no need to come back and delete it by hand — see the
"HIDE EXPIRED DATED ITEMS" block in `assets/js/site.js`. An item already
marked `schedule-item--past` is left alone (it's meant to stay, as history).
This is what makes the two real dates on `index.html`'s home page event
cards disappear on their own once they've passed — the grid just quietly
goes from 4 cards to 3, then 2 (the two evergreen "Private events" /
"Book a workshop" cards have no `data-date`, so they never disappear). If
every dated item in a `.schedule-list` has expired, the list is hidden and a
matching `.schedule-empty[data-schedule-empty-for]` element right after it —
present but hidden by default — is revealed instead. `events.html` and
`workshops.html` already have one of these ready; if you add a new
`schedule-list` elsewhere, add a `.schedule-empty[data-schedule-empty-for hidden]`
as its next sibling too, or nothing will show once it empties out.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — Raffaella + CTAs, 4 event cards, what I offer, contact |
| `about.html` | About Raffa — story, experience, ambition, my projects (Momo, Melting Pot, CASA) |
| `catering.html` | Four example catering offers, no prices, contact CTA |
| `workshops.html` | Workshop cards (incl. Melting Pot), how to book, upcoming dates |
| `private-events.html` | Aperitivo, lunch &amp; dinner — for small groups or for events |
| `events.html` | Upcoming public events, past events, past workshops, and hosting/managing events for others (weddings, tastings, product launches) |
| `contact.html` | The one form everything books through |
| `support.html` | The crowdfunding campaign and rewards (linked from About &amp; the footer, not the main nav) |

`private-events.html` was `private-chef.html` before an earlier round of
renames (it went through a brief `horeca.html`/`private-chef.html` detour
too, since reverted) — nothing still links to the old filenames, but if you
have old URLs bookmarked or shared anywhere outside this repo, update them.

## Structure

```
assets/css/site.css   all styling (design tokens at the top)
assets/js/config.js   ← the only file you need to edit for delivery/contact details
assets/js/site.js     nav, scroll reveals, FAQ, campaign band, expired-date hiding, form submission
images/               photographs
other_images/         extra photographs not yet used on the site
```

The "About Raffa" nav item has a dropdown submenu (Momo Cooking / Melting
Pot / CASA — the three `about.html#momo` / `#melting-pot` / `#casa` anchors).
On desktop it opens on hover; on mobile, where hover doesn't exist, it's
just always expanded inline under "About Raffa" in the full-screen menu. Add
a fourth project by adding a `<li><a href="about.html#id">Name</a></li>`
inside `<ul class="submenu">`, plus a matching `id="id"` on that project's
`.project-card` in about.html. The submenu only lives in the nav — the
footer keeps a plain "About Raffa" link, on purpose.

The nav and footer are written into each page. If you change them, change all
eight files.

## How booking works

There's no per-page booking form. Every "Book this" / "Contact me" button on
`catering.html`, `workshops.html`, `private-events.html` and the "Hosting &
managing events" cards on `events.html` links to
`contact.html?subject_topic=…&detail=…`, which pre-fills the dropdown and the
"specific workshop / event / package" field on the one contact form. If you
rename something (a workshop, a format, a package) or add a subject to the
`<select>`, keep the `subject_topic` values in those links matching the
`<option>` values in `contact.html` exactly, or the prefill silently does
nothing.

## Working on it locally

```bash
python3 -m http.server 8765    # then open http://localhost:8765
```

## Potential additions (not built)

- **Recipes** — a simple, styled recipes section connected to Instagram
  Reels was mentioned as an idea, including whether it should be
  bilingual (Italian/English). It's flagged as "potential" rather than
  requested, so nothing was built for it — ask if you'd like it scaffolded,
  and which language(s).

## Notes

- `index 1.html` is a leftover copy of the very first version of this site
  (the original crowdfunding-only landing page). It's still published at
  `/index%201.html`. Delete it when you're sure you don't need it.
- Open Graph images use relative paths. Once the real domain is known, make
  the `og:image` tags absolute (`https://…/images/…`) or link previews won't
  show the photo on most platforms.
