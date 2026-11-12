# Edible Hope Kitchen website

A fast, static website for Edible Hope Kitchen, built to run on GitHub Pages. It uses plain HTML, CSS, and a little JavaScript, with no build step or framework.

## Pages

| File | What it is | Replaces the old Squarespace page |
|---|---|---|
| `index.html` | Home: live "Open now" sign, impact numbers, menu, ways to help, news, map | `/` |
| `meals.html` | Get a meal: hours, menu, accessibility, directions | `/our-services` |
| `about.html` | Mission, history, team | `/support-us`, `/our-team` |
| `volunteer.html` | Shifts, signup, groups, FAQ | `/volunteer` |
| `donate.html` | Online, check, employer match, honor gifts, food, Fall Fundraiser | `/donate`, `/how-to-help` |
| `newsletter.html` | Signup and the full archive | `/newsletter-archive` |
| `gallery.html` | 41 photos with a full-screen viewer | `/gallery` |
| `jobs.html` | Job openings | `/job-opportunities` |
| `404.html` | Friendly "page not found" | — |

The folders `our-services/`, `support-us/`, `our-team/`, `how-to-help/`, `newsletter-archive/`, and `job-opportunities/` redirect the old Squarespace links, so bookmarks and Google results keep working. GitHub Pages serves `/donate`, `/volunteer`, and `/gallery` without the `.html` automatically.

## Publish on GitHub Pages

1. Create a new GitHub repository (for example `edible-hope-site`) and upload everything in this folder.
2. In the repo, go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then branch `main` and folder `/ (root)`. Save.
3. After a minute the site is live at `https://<your-username>.github.io/edible-hope-site/`.

### Use the real domain (ediblehopekitchen.org)

Do this only after the **Before you switch over** steps below.

1. In **Settings → Pages → Custom domain**, enter `www.ediblehopekitchen.org` and save. GitHub adds a `CNAME` file.
2. At the domain registrar (Squarespace Domains if the domain was bought there), set the DNS:
   - `CNAME` record: `www` → `<your-username>.github.io`
   - `A` records for the bare domain `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Once the DNS check passes, tick **Enforce HTTPS**.

## Before you switch over (important)

These three things currently depend on Squarespace:

1. **Online donations.** Squarespace's donation form can't move to GitHub Pages. Pick a donation provider and paste its link into `assets/js/main.js` (the `donateUrl` setting at the top). Every "Donate online" button updates automatically.
   - Good free or low-cost options: Zeffy (free for nonprofits), Givebutter, PayPal Giving Fund, or St. Luke's own online giving page.
   - Since donations legally go to St. Luke's (the 501(c)(3)), check with St. Luke's which account should receive them.
   - ⚠️ Until you change it, `donateUrl` points to the old Squarespace donate page. That's fine while Squarespace is live. After the domain moves, that link would point back to this site, so it **must** be changed first.
2. **Photos.** Photos load from Squarespace's image servers. Before cancelling Squarespace, run this from the repo folder, then commit and push:
   ```
   python3 scripts/localize_images.py
   ```
   It downloads every photo and the job PDF into `assets/` and updates all the pages to use the local copies.
3. **Newsletter signup.** The archive links (Mailchimp) keep working. To connect the signup form:
   in Mailchimp, go to **Audience → Signup forms → Embedded forms** and copy the URL in the form's `action="…"`. In `newsletter.html` and the other pages, find `REPLACE_WITH_MAILCHIMP_FORM_URL` and replace it (use find-and-replace across all files). Until you do, the Subscribe button opens an email to the kitchen with the signup request already written.

## Everyday edits

- **New newsletter:** in `newsletter.html`, copy one `<li>…</li>` line in the archive list and change the title, month, and link. Do the same for the three "Latest issues" cards on `index.html` and `newsletter.html`.
- **Hours, address, or phone:** search all `.html` files for the old value and replace it. If the hours change, also update the open-sign times in `assets/js/main.js` (480 = 8:00 AM and 600 = 10:00 AM, counted in minutes after midnight).
- **Colors and fonts:** all in the `:root` block at the top of `assets/css/styles.css`.
- **Logo:** the bowl-and-sunrise icon is inline SVG in each page header and footer, plus `assets/favicon.svg`. To use the original logo image, replace the `<svg>…</svg>` inside `.brand` with an `<img>`.

## Things to confirm with the kitchen

- Team headshots were matched to Andy and Nick by their order on the old page. Check they're the right way around.
- The Community Manager job listing may be out of date, since Andy now holds that role. Remove it from `jobs.html` if it's filled.
- Photo descriptions (alt text) are generic because the originals had none. Better descriptions help screen-reader users and search engines.
- Impact numbers (40,000+ meals, ~200 volunteers, 38+ years) come from the old site. Update them as they change.
- A short line such as "$25 = X breakfasts" on the donate page usually lifts giving. Add one if the kitchen knows its cost per meal.
- The old site listed no social media accounts. Add links to the footer if there are any.
