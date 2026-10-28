# Pilates Studio

A React site for a boutique reformer Pilates studio, built as a design case study. It has a film-led home page, class and teacher pages, a live timetable with filters, and a booking flow where clients pick their exact reformer.

Built with **Vite + React 19 + React Router 7**. No backend is needed to run it: bookings and credits are handled by a mock service that saves to the browser.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in /dist
npm run preview   # serve the production build
```

Node 18 or newer.

## Project structure

```
public/media/            Photos and videos (swap files here, keep the names)
src/
  data/                  All editable content
    classes.js           Class types, spring level, duration, capacity, image
    teachers.js          Teacher profiles (add `photo` to replace initials)
    studios.js           Locations, rooms, facilities, hours
    content.js           Pricing plans, FAQs, announcement bar, drop-in price
    media.js             Image and video paths
  services/
    bookingService.js    The only "backend" the app talks to (mock for now)
    mockSchedule.js      Generates a repeatable 7-day timetable from today
  context/
    StudioContext.jsx    Shared state: sessions, account, panels, toasts
  components/            Header, Footer, cards, session row, booking panels
                         (each with a matching .css file, e.g. Header.jsx + Header.css)
  pages/                 Home, Classes, Timetable, Teachers, TeacherProfile,
                         Studios, Pricing, NotFound (with .css where they need it)
  styles/global.css      Design tokens, base styles, buttons and shared helpers
```

### Styles

`styles/global.css` holds the design tokens (colours, fonts, spacing) and anything used across many files: buttons, type helpers like `.eyebrow` and `.lede`, the spring-level dots and section spacing. It loads first, in `main.jsx`.

Every other stylesheet sits next to the file it styles and is imported at the top of it, for example `import "./Footer.css";` in `Footer.jsx`. `Classes.jsx`, `Teachers.jsx` and `NotFound.jsx` have no stylesheet of their own because they're built entirely from shared components.

Vite bundles these as normal global CSS, so class names still need to be unique across files. To make them scoped per component, rename a file to `Footer.module.css` and use `className={styles.footer}`.

## Editing content

Everything a studio would change lives in `src/data/`. For example, to add a teacher, add an object to `TEACHERS` in `teachers.js` and list the class ids they teach. They appear on the Teachers page, in the timetable filters and on the timetable automatically.

Colours, fonts and spacing are CSS variables at the top of `src/styles/global.css`.

## Connecting a real studio management platform

`src/services/bookingService.js` exposes five async functions:

| Function | Does |
| --- | --- |
| `load()` | Returns `{ sessions, account }` |
| `book(sessionId, { spot, payment })` | Books a spot, returns the updated `{ sessions, account }` |
| `joinWaitlist(sessionId)` | Adds the client to the waitlist |
| `cancel(sessionId)` | Cancels a booking or leaves a waitlist |
| `purchase(planId)` | Buys a pack or membership |

To go live with Mindbody, bsport, Mariana Tek, TeamUp or Momence, replace the bodies of these functions with calls to that platform's API and map its responses to the shapes documented at the top of the file. The rest of the app doesn't need to change.

Two things to keep in mind:

- **Keep API keys off the client.** Platform API keys must not ship in browser code. Put a small server or serverless function (Vercel, Netlify, Cloudflare Workers) between the site and the platform, and have `bookingService.js` call that.
- **Client login.** Real bookings need an authenticated client. Most platforms provide their own login or an OAuth flow; add a sign-in step before `book()` and pass the client's token through your server.

For testing, Mindbody's developer sandbox (SiteId `-99`) gives you real-looking classes and test client accounts.

## Deploying

`npm run build` outputs a static site to `/dist`. Because it uses browser routing (`/teachers/maya-okafor`), configure your host to serve `index.html` for unknown paths:

- **Netlify:** add `public/_redirects` containing `/*  /index.html  200`
- **Vercel:** works out of the box for Vite projects
- **Other hosts:** enable an SPA fallback to `index.html`

## Media credits

Videos are from Mixkit (free licence). Some photos show other brands (a "KARVE" reformer, a "YOGA" lightbox, "Body Mind Soul" wall text); replace them before using this for a real studio.
# pilates-website
