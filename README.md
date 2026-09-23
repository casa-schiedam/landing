# CASA — website

Website for Raffaella / CASA (Schiedam, NL): catering, cooking
workshops & lessons, and private events, plus the crowdfunding campaign for
a permanent space. Plain HTML, one stylesheet, two small scripts — no
framework, and nothing to install or run yourself. The one exception is
workshop/event dates: those come from small Markdown files that Jekyll (run
automatically by GitHub Pages, not by you) turns into the schedule lists on
`workshops.html` and `events.html`. See **"Adding a date"** below, or
`ADDING-DATES.md` for the phone-friendly version. Deploys to GitHub Pages
automatically on every push to `main` (`.github/workflows/static.yml`,
which builds with Jekyll before publishing).

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
  many workshops/events so far); and for the **Melting Pot** row, confirmation
  that **Ferm** is a real second venue (only Rose Molen in Delft is confirmed)
  and how often it actually runs.
- **`private-events.html`** — minimum group size for aperitivo / lunch /
  dinner at home; and the "Events we've done" section (see below) — left
  completely empty, on purpose, until you add real ones.

The two real "Pasta Making with Raffa & Vale" dates at Rose Molen, Delft (10
Oct and 15 Nov 2026, sourced from [Bij de Roos's booking page](https://bijderoos.nl/webshop/pasta-making-with-rafa-and-vale/))
already live in `_workshops/` — see **"Adding a date"** below for how those
files work. Both link out to Bij de Roos since booking happens there, not on
this site. Past events are still an honest empty state — add real ones as
they happen (see `ADDING-DATES.md`).

Workshop/private-event/catering **durations and group sizes** in the listing
pages are reasonable-sounding placeholders too, not confirmed numbers — check
them. The five photos on `private-events.html`'s "For your event" cards
(Celebrations & private parties, Weddings, Guided food tasting, Product
launches & company events, Other) are generic food shots, not photos from
real past events of that kind —
swap them for real ones if you have them (or use the "Events we've done"
section below for that, which is exactly what it's for).

### "Events we've done" (`private-events.html`)

Deliberately empty. Add two or three real weddings, tastings or launches
you've actually done, each with a photo you have the client's permission to
publish, and a short line (what it was, roughly how many guests). These are
the references that sell the service, so they live here — not on the
`events.html` agenda, which is kept as pure upcoming/past dates.

## Adding a date (workshop or event)

**For Raffa: see `ADDING-DATES.md`** — the phone-friendly, non-technical
version of everything below.

Workshop and event dates are **Jekyll collections**, not hand-edited HTML.
Adding a date means adding one small Markdown file — never touching
`workshops.html` or `events.html` directly:

```
_templates/workshop.md   ← copy this…                 _templates/event.md   ← …or this
_workshops/YYYY-MM-DD-short-slug.md  ← …into here      _events/YYYY-MM-DD-short-slug.md  ← …or here
```

A workshop (`_workshops/`) shows up on **both** workshops.html and the
Agenda. An event (`_events/`) — a market, a pop-up, a tasting — shows up
on the **Agenda only**. Both collections share one front-matter schema:

| Field | Required? | Notes |
|---|---|---|
| `title` | ✅ | |
| `date` | ✅ | `YYYY-MM-DD` |
| `book_url` | ✅ | |
| `time`, `duration`, `place`, `price`, `seats` | | each only shown if set |
| `tags` | | a list of short labels |
| `book_label` | | defaults to "Book →" |
| `category` | events only | one of `tasting`, `popup`, `market`, `other` — workshops are always labelled "Workshop" automatically |
| `past_note` | | shown instead of the booking button once the date has passed |

Both collections have `output: false` in `_config.yml` — no individual
pages are generated, they only ever get rendered inline via
`_includes/schedule-item.html`, the one place that owns the
`.schedule-item` markup so workshops.html and events.html can never drift
apart. `workshops.html`'s schedule and events.html's Upcoming/Past lists
each pull from `site.workshops` (and, on events.html, `site.events` too,
merged in) via a small Liquid loop — read the comment right above each
`.schedule-list` on those two pages for the exact snippet.

**Two layers keep expired dates in the right place.** At *build* time,
Jekyll only renders dates that are still in the future (`site.time`
compared against each item's `date`) into the "upcoming" lists, and
Agenda's "Past events" list gets everything already in the past,
most-recent-first, with the booking button swapped for `past_note` if one
is set. Between one build and the next — the day a date quietly tips over
from future to past while the site hasn't rebuilt yet — the **client-side**
layer in `assets/js/site.js` catches it: any element with a
`data-date="YYYY-MM-DD"` attribute (which is exactly what
`schedule-item.html` renders) that's now in the past gets moved into the
page's `[data-schedule-past]` list if it has one (Agenda does; workshops.html
doesn't, so there it's just removed, matching how it always worked). An
item already marked `schedule-item--past` — i.e. Jekyll already rendered it
that way at build time — is left alone by this client-side pass, so the two
layers never fight each other. If every item in a `.schedule-list` is gone,
the list hides and the matching `.schedule-empty[data-schedule-empty-for]`
right after it is revealed — and the reverse too, now: a list that started
empty (nothing was upcoming when the site last built) but gains an item via
the client-side move above gets its fallback hidden again. Both directions
matter now that a list's *starting* state depends on what Jekyll saw at
build time, not just on what the client-side script does over time.

This same `data-date` + `.schedule-empty[data-schedule-empty-for]` pattern
still works anywhere else on the site too — e.g. `index.html`'s home-page
event cards, which aren't part of either collection and don't need to be.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — Raffaella + CTAs, 4 event cards, what I offer, contact |
| `about.html` | About Raffa — story, experience, ambition, my projects (Momo, Melting Pot, CASA — 3 full-width horizontal sections) |
| `catering.html` | Four example catering offers, no prices, contact CTA |
| `workshops.html` | Workshop cards (3-col grid, Melting Pot first &amp; highlighted), how to book, upcoming dates |
| `private-events.html` | Organized by scale: at your home for small groups (aperitivo/lunch/dinner) vs. for your event (celebrations & private parties, weddings, guided food tasting, product launches & company events, other) |
| `events.html` | A pure agenda — upcoming public dates, past events, past workshops, and one line pointing to Private Events for anything bespoke |
| `contact.html` | The one form everything books through |
| `support.html` | The crowdfunding campaign and rewards (linked from About &amp; the footer, not the main nav) |

The nav/footer link to `events.html` reads **"Agenda"**, not "Events" — kept
deliberately distinct from "Private Events" in the nav, to stop the two from
being confused. The filename didn't change, only the label.

`private-events.html` was `private-chef.html` before an earlier round of
renames (it went through a brief `horeca.html`/`private-chef.html` detour
too, since reverted) — nothing still links to the old filenames, but if you
have old URLs bookmarked or shared anywhere outside this repo, update them.

## Structure

```
assets/css/site.css   all styling (design tokens at the top)
assets/js/config.js   ← the only file you need to edit for delivery/contact details
assets/js/site.js     nav, scroll reveals, FAQ, campaign band, expired-date hiding, form submission
images/               photographs actually used by the site

_config.yml            Jekyll config — the workshops/events collections, and what's excluded from the build
_workshops/            one file per workshop date (see "Adding a date")
_events/               one file per non-workshop date (market, pop-up, tasting…)
_templates/            copy-and-fill starting points for the two folders above
_includes/schedule-item.html   the one place that renders a date — workshops.html and events.html both call into it
```

`other_images/` (extra, unused source photos) and `CASA_Crowdfunding_landing.Rproj`
(an old RStudio project file) still exist locally but are gitignored — the
GitHub Pages workflow publishes the *entire* repo (`path: '.'`), so anything
tracked here is publicly served even if no page links to it. Both are kept
on disk as a local reserve, just no longer shipped. If you want a photo from
`other_images/`, move it into `images/`, reference it from a page, and it'll
be tracked and deployed normally.

The "About Raffa" nav item has a dropdown submenu (Momo Cooking / Melting
Pot / CASA — the three `about.html#momo` / `#melting-pot` / `#casa` anchors).
On desktop it opens on hover; on mobile, where hover doesn't exist, it's
just always expanded inline under "About Raffa" in the full-screen menu. Add
a fourth project by adding a `<li><a href="about.html#id">Name</a></li>`
inside `<ul class="submenu">`, plus a matching `id="id"` on that project's
`.project-row` in about.html (the three projects are full-width horizontal
sections, not a card grid — image left, text right). The submenu only lives
in the nav — the footer keeps a plain "About Raffa" link, on purpose.

The nav and footer are written into each page. If you change them, change all
eight files.

### Nav submenu ids vs. content ids

The "About Raffa" submenu and the format anchors on `private-events.html`
both work the same way: an `id` on a section/row, linked to from the nav or
from a "Book this" card. If you rename or remove one, update both ends —
the id on the target element, and the `href="page.html#id"` that points to
it — or the link silently goes nowhere.

## How booking works

There's no per-page booking form. Every "Book this" / "Contact me" button on
`catering.html`, `workshops.html` and `private-events.html` links to
`contact.html?subject_topic=…&detail=…`, which pre-fills the dropdown and the
"specific workshop / event / package" field on the one contact form. If you
rename something (a workshop, a format, a package) or add a subject to the
`<select>`, keep the `subject_topic` values in those links matching the
`<option>` values in `contact.html` exactly, or the prefill silently does
nothing.

**One topic covers all of Private Events, including the "for your event"
formats** (weddings, tastings, product launches, etc.) — everything uses
`subject_topic=Private%20events`, distinguished only by `detail=` (e.g.
`detail=Wedding`, `detail=Tasting`). That was previously split across two
topics (`Private events` and `Hosting an event`); it's consolidated now so
a single mailbox filter on `subject_topic=Private%20events` catches
everything, rather than needing two rules.

## Working on it locally

For everything except dates, a plain static server is enough — pages,
styling and scripts all work, only the schedule lists stay empty since
nothing processes the Liquid loops in workshops.html/events.html:

```bash
python3 -m http.server 8765    # then open http://localhost:8765
```

To see real dates locally (or to test one before committing it), run an
actual Jekyll build instead — same engine GitHub Pages uses:

```bash
gem install jekyll --no-document   # once
jekyll serve   # then open http://localhost:4000
```

## Potential additions (not built)

- **Recipes** — a simple, styled recipes section connected to Instagram
  Reels was mentioned as an idea, including whether it should be
  bilingual (Italian/English). It's flagged as "potential" rather than
  requested, so nothing was built for it — ask if you'd like it scaffolded,
  and which language(s).

## Notes

- Open Graph images use relative paths. Once the real domain is known, make
  the `og:image` tags absolute (`https://…/images/…`) or link previews won't
  show the photo on most platforms.
