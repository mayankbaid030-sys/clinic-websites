# AV Jaiswal Arts Photography — Website

Production-ready, single-page ultra-premium photography studio website.

## Structure
- `index.html` — full page markup (hero, about, services, portfolio, testimonials, booking, footer)
- `styles.css` — design system: champagne cream / alabaster / espresso-bronze palette with gold accents, splash animation, spotlight canvas styling, all component styles
- `script.js` — splash reveal sequencing, word-by-word hero reveal, canvas spotlight mouse effect, scroll reveals, portfolio filtering, reel modal, multi-step booking modal

## Required assets (drop into `assets/`)
Replace these placeholders with real media before launch:
- `hero-poster.jpg` — fallback poster for hero video
- `hero-reel.mp4` — looping cinematic wedding/portrait reel for the hero background (AI-generated or studio footage)
- `showreel.mp4` — full showreel for the video modal
- `founder.jpg` — portrait of AV Jaiswal for the About section
- `portfolio/wedding-1.jpg`, `wedding-2.jpg`, `wedding-3.jpg`
- `portfolio/prewedding-1.jpg`, `prewedding-2.jpg`
- `portfolio/maternity-1.jpg`
- `portfolio/cinematic-1.jpg`, `cinematic-2.jpg`

## Key features implemented
1. **Splash screen** — 5-column sliding boxes with `cubic-bezier(0.96,-0.02,0.38,1.01)` easing that lift to reveal the page.
2. **Hero** — scale/rotate video entrance, word-by-word blur-to-clear headline reveal ("Timeless Photo Stories Crafted With Style"), warm vignette overlay, dual CTAs + showreel trigger.
3. **Spotlight canvas** — radial gradient mask that follows the cursor across the hero viewport (`<canvas id="spotlightCanvas">`).
4. **Micro-interactions** — hover lift/scale on every button, underline sweep on nav links, image zoom on portfolio hover, card fill-reveal on services.
5. **Scroll reveal** — IntersectionObserver-driven fade/rise for section content as the user scrolls.
6. **Direct contact** — click-to-call header/footer phone links (`091654 44468`), Facebook + Instagram icons, persistent floating WhatsApp button.
7. **Booking modal** — 4-step flow (event type → date → details → confirm) with inline validation and a success state.
8. **Video reel modal** — full-screen player with custom mute toggle and fade transitions.
9. **Portfolio** — masonry grid with category filtering (Wedding / Pre-Wedding / Maternity / Cinematic).
10. **Footer** — full studio address, quick links, contact, and social channels.

## Notes
- Booking form currently shows a client-side confirmation state; wire `bookingForm`'s submit handler in `script.js` to your booking API / CRM / email service before production launch.
- Swap in real photography and video assets — placeholders are referenced by filename only.
- Colors are defined as CSS custom properties in `styles.css :root` for easy rebranding.
