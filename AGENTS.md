# TheMan67

Static HTML/CSS/ES modules; no runtime dependencies. Run `npm run check` and `npm run build`. Preview: `npm run dev`.

- Preserve section order: hero → about → services → barbers → gallery → contact → footer, existing section IDs and booking channels.
- Business facts come from the original website; do not invent awards, qualifications, reviews, experience or guarantees. Prices and contact details must stay consistent with JSON-LD.
- Design tokens: `src/styles/tokens.css`. Keep local fonts, visible focus, native dialog, reduced motion and no-JS fallbacks.
- Generated hero is an editorial illustration. Never label it as a portfolio photo. The original portrait and 9 portfolio photos must stay intact.
- Deploy only `dist/`; never deploy `archive/`, docs, tooling or raw media. Do not change DNS or hosting or connect auto-deployment without verifying the configuration.
- Existing production Yandex Metrika counter is retained, restricted to theman67.ru and www.theman67.ru; previews must not send events.
