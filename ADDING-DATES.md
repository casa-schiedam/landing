# Adding a date to the site

You never need to edit `workshops.html` or `events.html` by hand. A date on
the site is just one small file. This is the same whether you're on a
computer or doing it from your phone on the github.com website — the steps
below are written for a phone, since that's usually more fiddly.

There are two kinds of date:

- **A workshop** with an open seat anyone can book — this shows up on both
  the Agenda page and the Workshops page. Template: `_templates/workshop.md`.
- **Anything else public** — a market, a pop-up dinner, a tasting — shows up
  on the Agenda page only. Template: `_templates/event.md`.

If you're not sure which one, ask: "can a stranger book a seat at this?" —
if yes, it's a workshop.

## Add a date

1. Open **github.com** and go to the site's repository (**casa-schiedam/landing**).
2. Open the **`_templates`** folder, then open **`workshop.md`** (or
   **`event.md`** for a non-workshop date).
3. Tap the **pencil/edit icon** at the top right of the file to open it for
   editing. (On a phone, if you don't see a pencil, tap the **"..."** menu
   first.)
4. **Select all the text and copy it.**
5. Go back (don't save anything here — you're only copying).
6. Go to the **`_workshops`** folder (or **`_events`** for a non-workshop
   date).
7. Tap **"Add file" → "Create new file."**
8. In the file name box, type a name in this exact shape:

   ```
   2027-03-14-fresh-pasta-lab.md
   ```

   That's the date the thing happens, then a few words about what it is,
   separated by dashes, all lowercase, ending in `.md`. The date in the
   file name doesn't have to be perfect — it's really the "date:" field
   inside the file (step 10) that the site actually uses — but keeping
   them the same makes the list of files easier to scan later.
9. **Paste** the text you copied in step 4 into the big text box.
10. Now edit the fields between the two `---` lines to match your date:
    - `title` — what it's called
    - `date` — the real date, as `YYYY-MM-DD` (year-month-day)
    - `time`, `duration`, `place`, `price`, `seats` — fill in what you
      know, delete the line entirely for anything you don't want shown
    - `tags` — short labels, one per line starting with `-`
    - `book_url` — where someone actually books or gets more info
    - `book_label` — the text on the booking button (leave it out and it
      just says "Book →")
    - `category` — **events only** — one of `tasting`, `popup`, `market`,
      `other`
    - `past_note` — a short line shown once the date has passed instead of
      the booking button, e.g. "Sold out, thank you!" (optional — leave it
      out and nothing shows there once it's past)
11. **Delete the whole comment block at the top** — everything between
    `<!--` and `-->`. It's only there to explain the file; it shouldn't be
    published.
12. Scroll down, add a short commit message (e.g. "Add fresh pasta lab
    workshop"), and tap **"Commit changes."**
13. Wait about a minute, then check the live site — the date should be
    there.

## Fix a mistake

Open the file in `_workshops/` or `_events/`, tap the pencil to edit it,
fix whatever's wrong, and commit again the same way as steps 12–13 above.

## Cancel a date

Open the file, tap the **"..."** menu (or the trash icon, if you see one),
and **delete the file**. Commit the deletion. The date disappears from the
site within about a minute.

If people already know about it and you'd rather leave a note than make it
vanish, you can instead add a `past_note:` line (see step 10) explaining
it's cancelled, and change nothing else — it'll keep showing under "Past
events" with that note once its date passes, or you can just leave it
where it is if it hasn't happened yet and change the date to something
already in the past so it moves there immediately.

## What happens automatically

- Dates in the future show up under "Upcoming."
- The moment a date's day has passed, it moves itself to "Past events" (on
  the Agenda) — a workshop with no Agenda-visible past list just
  disappears once it's past, since only the Agenda keeps a history.
- You never need to move anything by hand.
