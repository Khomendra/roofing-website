# Roofing Website — Draft Template

A single-page, static website template for a roofing contractor business. Built with plain HTML, CSS and JavaScript — no framework, no build step, no dependencies to install.

**⚠️ This is a draft.** Company name, phone numbers, email, address, and a couple of social/review links are currently placeholders like `[Your Company Name]`. See [Before you launch](#before-you-launch) below.

## Preview

Live via GitHub Pages (once enabled in **Settings → Pages** for this repo): `https://khomendra.github.io/roofing-website/`

## Features

- **Hero** with a full-bleed photo, animated headline reveal, and trust stats (rating, years trading, guarantee length)
- **Services grid** — six service cards with photo, title and short tag
- **About / why choose us** section with stats
- **Process** — a simple 4-step "how it works"
- **Gallery** with category filtering (All / New / Repairs / Flat / Slate) and a click-to-zoom lightbox with keyboard (←/→/Esc) support
- **Testimonials carousel** — drag-to-scroll with prev/next buttons
- **FAQ accordion**
- **Contact form** with client-side validation (name, phone, email, UK postcode format, service, urgency) — front-end only, not wired to a backend
- **Sticky mobile call-to-action bar**
- Scroll-triggered reveal animations, animated counters, scroll-spy navigation highlighting, and a floating nav bar that condenses on scroll
- Fully responsive, respects `prefers-reduced-motion`, keyboard-focus visible throughout

## Tech stack

- HTML5, CSS3 (custom properties for theming, no preprocessor), vanilla JavaScript (no libraries)
- [Fraunces](https://fonts.google.com/specimen/Fraunces) + [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- Stock photography from [Unsplash](https://unsplash.com) (placeholder images — swap for real project photos before launch)

## Project structure

```
roofing-website/
├── index.html   # all page content and structure
├── style.css    # design tokens (colors, type, spacing) + component styles
├── script.js    # nav, scroll reveal, gallery/lightbox, carousel, FAQ, form validation
└── .github/
    └── workflows/
        └── static.yml   # GitHub Pages deployment (deploys on every push to main)
```

## Getting started

No build tools required.

```bash
git clone https://github.com/Khomendra/roofing-website.git
cd roofing-website
```

Then just open `index.html` in a browser, or serve it locally so relative paths and fonts behave exactly as they will in production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Before you launch

Search the codebase for square-bracket placeholders and stock content, and replace:

| Placeholder | Where | Replace with |
|---|---|---|
| `[Your Company Name]` | `<title>`, meta description, header/footer logo, hero & about copy, copyright line | Your real business name |
| `[Landline Number]` / `[Mobile Number]` | Nav bar, contact section, footer, sticky mobile bar | Real phone numbers (update the `href="#"` on each to `tel:+44...`) |
| `[Your Email Address]` | Contact section, footer | Real email (update `href="#"` to `mailto:...`) |
| `[Your Business Address]` | Contact section, footer | Real office/registered address |
| `[00000000]` | Footer copyright line | Companies House registration number |
| WhatsApp button, Google Reviews link | Contact section | Point `href="#"` to your real `wa.me/<number>` and Google review URL |
| Unsplash photo URLs | Services, about, gallery | Your own project photography |
| Testimonial names/quotes, FAQ copy, service areas | Reviews & FAQ sections | Real (or at least representative) content |

The footer already carries a visible note that this is draft content — remove that line once the real details are in.

## Deployment

`.github/workflows/static.yml` deploys the repository to GitHub Pages automatically on every push to `main`. If Pages isn't live yet, enable it under **Settings → Pages → Source: GitHub Actions**.

## License

No license specified yet — add one (e.g. MIT) if you intend this to be reused or shared publicly.
