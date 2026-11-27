import { Footer } from "./SiteChrome";
import { BelowFold } from "./BelowFold";
import { useEffect } from "react";
import { HOME } from "@/content/home";
import { useMotionPreference, useLite } from "@/hooks/useMotionPreference";
import { SmoothScroll } from "./SmoothScroll";
import { HeroSequence } from "../HeroSequence/HeroSequence";
import { applyChromeTheme } from "@/lib/chrome-theme";
import { Manifesto } from "./Sections";
import { Preloader } from "./Preloader";
function ThemeObserver() {
  useEffect(() => {
    let alive = true;
    let cleanup = () => {};
    import("@/lib/gsap-setup").then((m) => {
      if (!alive) return;
      const { gsap, ScrollTrigger } = m.setupGSAP();
      let observer: MutationObserver | undefined;
      const ctx = gsap.context(() => {
        const registered = new WeakSet<HTMLElement>();
        const registerThemeTriggers = () => {
          document
            .querySelectorAll<HTMLElement>("[data-theme]:not([data-chrome-ignore])")
            .forEach((element) => {
              if (registered.has(element)) return;
              registered.add(element);
              ScrollTrigger.create({
                trigger: element,
                start: "top 56px",
                end: "bottom 56px",
                onToggle: (self) => {
                  if (!self.isActive) return;
                  applyChromeTheme(element);
                },
              });
            });
        };

        registerThemeTriggers();
        observer = new MutationObserver(registerThemeTriggers);
        observer.observe(document.querySelector("main") ?? document.body, {
          childList: true,
          subtree: true,
        });
      });

      cleanup = () => {
        observer?.disconnect();
        ctx.revert();
      };
      document.fonts.ready.then(() => {
        if (alive) ScrollTrigger.refresh();
      });
    });

    return () => {
      alive = false;
      cleanup();
    };
  }, []);
}
export function HomePage() {
  const { reduced, ready } = useMotionPreference();
  const lite = useLite();
  const content = (
    <div className={reduced || lite ? "static-hero" : ""}>
      <a className="skip-link" href="#manifesto">
        {HOME.skipContent}
      </a>
      <main id="main-content" tabIndex={-1}>
        <HeroSequence reducedMotion={reduced || lite} />
        <Manifesto />
        <BelowFold reduced={reduced || lite} />
      </main>
      <Footer reduced={reduced} />
      <ThemeObserver />
      <noscript>
        <style>
          {
            ".colour-curtain,.hero-art canvas,.hero-end,.film-controls,.team-strip-controls,.sector-progress,.way-film-progress,.testimonial-controls{display:none}.team-strip{overflow-x:auto}.team-strip-track{transform:none!important}.team-strip-item{pointer-events:none}.team-strip-item .media-frame{aspect-ratio:3/2}.sector-curtain{display:none}.hero-track{height:auto}.hero-stage{position:relative;height:auto}.hero-poster{visibility:visible!important}.hero-captions{position:relative;bottom:auto;left:auto;padding:240px 24px 48px;width:100%}.hero-caption{position:relative;clip-path:none;transform:none;font-size:48px;margin-bottom:32px}.hero-actions{position:relative;visibility:visible;bottom:auto;left:auto;padding:0 24px 100px}.sectors-track,.way-track{height:auto}.sectors-stage,.way-stage{position:relative;height:auto;padding:80px 0}.sectors-list{width:auto;display:grid}.sector{width:auto}"
          }
        </style>
      </noscript>
    </div>
  );
  const page = ready && !reduced && !lite ? <SmoothScroll>{content}</SmoothScroll> : content;

  return (
    <>
      {page}
      <Preloader ready={ready} reduced={reduced} />
    </>
  );
}
