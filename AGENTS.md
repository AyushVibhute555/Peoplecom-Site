<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Peoplecom implementation rules

- Keep the existing TanStack Start/React framework; never migrate it, so the app remains compatible with its host.
- Keep components in `src/components/home`, hooks in `src/hooks`, configuration in `src/config`, copy in `src/content/home.ts` (other copy in `src/content/*.ts`) and media references in `src/content/media.ts`; named exports, strict TypeScript, no `any` or `console.log`, for predictable ownership.
- Store unknown content with `placeholder: true`; production filters it out and preview labels it “Placeholder”, to avoid publishing invented facts.
- Keep all copy in server HTML; no browser globals/storage during render or module evaluation; initialize triggers, tickers, canvas, Lenis and Three inside cleaned-up effects, to preserve SSR and StrictMode safety.
- Use `motion/react` for component springs, drag, layout, presence and per-component scroll values; GSAP public plugins ScrollTrigger/SplitText and `@gsap/react` for scrubbed timelines, masked type and tracks; `lenis/react` for scrolling. Never animate one element property with two libraries, to prevent competing updates.
- GSAP ticker alone drives Lenis with `autoRaf: false` and `lagSmoothing(0)`; no scroll listeners; scroll loops change only transform/opacity/clip-path, to control frame cost.
- Pin only with CSS sticky in tall wrappers, never ScrollTrigger `pin: true`; avoid overflow on sticky ancestors and use body `overflow-x: clip`, to keep React layout stable.
- Scope GSAP with `useGSAP`, kill triggers, destroy Lenis and cancel animation frames; refresh ScrollTrigger after fonts load and size changes; entrance reveals play once without re-hiding, to avoid leaks and flicker.
- Add Three only when the requested phase needs it; use React 19-compatible fiber 9/drei 10 (React 18: fiber 8/drei 9), to avoid unnecessary dependencies and version conflicts.
- Centralize the exact brand colours in CSS-variable tokens and shadcn roles; section `[data-theme='paper|teal|ink|yellow|signal']` sets `--bg`, `--fg`, `--accent`, `--rule`, to preserve section themes without ad hoc values.
- Animate variable font width only on hover/one-shot entrances in fixed-size wrappers, never scroll scrubs; reserve media ratios, use safe-area insets/100svh, to avoid layout shifts.
- Persist Motion preference only after mount; reduced mode turns Lenis off, uses static hero and removes sticky/parallax/cursor effects; low-end mode reduces frames and removes tilt/cursor, to preserve accessibility and device performance.
- Lazy-load below-fold features and Three; use async-decoded lazy AVIF/WebP, preload critical fonts and separate mobile/desktop frame sets; timeout preloader at 6 seconds and retain poster/noscript fallbacks, to prevent blank experiences.
- Serve the uploaded SVG unchanged as the real public favicon and reference it from the root head, to use the supplied brand asset without altering it.

- Keep the frame-set availability switch off until actual frame files exist; the six-scene canvas storyboard avoids missing-resource requests.

- Services owns one reducer-driven active row and one floating preview; touch uses a single accordion panel, keeping desktop row geometry stable.

- Phase-three horizontal sectors measure their scroll distance; reduced mode is static and project filtering shares one typed predicate with the work page.

- Way keeps its four ordered steps mounted and delegates theme changes to the shared browser-only chrome controller; testimonial and logo eligibility remain pure, testable predicates.

- Phase-five forms share browser/server Zod schemas and store privately through public server functions after a honeypot and atomic hashed-IP rate limit; no lead-reading endpoint exists.
- Shared navigation and footer serve home, contact, stubs and 404; the studio strip measures its bounds and the clock starts only after mount to preserve SSR.

- Below-fold modules use SSR-resolved React lazy boundaries; hero painting is GSAP-ticker driven with React updates only on caption changes, keeping scroll work bounded.
- Social image URLs derive from the request origin and a resized poster asset; never hardcode a preview origin as a public canonical or sitemap host.
