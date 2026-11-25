import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HERO_CONFIG } from "./HeroSequence";

type HeroConfig = typeof HERO_CONFIG;

type NavbarRevealProps = {
  config: HeroConfig;
  backdropRef: RefObject<HTMLDivElement | null>;
  showAbout: boolean;
  reducedMotion: boolean;
};

export function NavbarReveal({ config, backdropRef, showAbout, reducedMotion }: NavbarRevealProps) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<Array<HTMLDivElement | null>>([]);
  const logoRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      let cancelled = false;
      let resizeTimer: number | undefined;
      let navCtx: gsap.Context | null = null;
      let flip: gsap.core.Timeline | null = null;

      const teardown = () => {
        flip?.kill();
        flip = null;
        navCtx?.revert();
        navCtx = null;

        const background = backgroundRef.current;
        const items = itemsRef.current;
        const logo = logoRef.current;
        const links = linksRef.current.filter(
          (element): element is HTMLDivElement => element !== null,
        );

        logo?.classList.remove("navbar-logo-pinned");
        const targets = [background, items, logo, ...links].filter(
          (element): element is HTMLDivElement => element !== null,
        );
        if (targets.length) gsap.set(targets, { clearProps: "all" });
      };

      const build = () => {
        const background = backgroundRef.current;
        const items = itemsRef.current;
        const logo = logoRef.current;
        const backdrop = backdropRef.current;
        const links = linksRef.current.filter(
          (element): element is HTMLDivElement => element !== null,
        );
        if (!background || !items || !logo || !backdrop) return;

        navCtx = gsap.context(() => {
          if (reducedMotion || window.innerWidth < 720) {
            logo.classList.add("navbar-logo-pinned");
            gsap.set(logo, { width: 250 });
            gsap.set([background, items], {
              width: "100%",
              height: "100vh",
            });
            return;
          }

          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const initialWidth = background.offsetWidth;
          const initialHeight = background.offsetHeight;
          const initialLinksWidths = links.map((link) => link.offsetWidth);

          const state = Flip.getState(logo);
          logo.classList.add("navbar-logo-pinned");
          gsap.set(logo, { width: 250 });
          flip = Flip.from(state, {
            duration: 1,
            ease: "none",
            paused: true,
          });

          ScrollTrigger.create({
            trigger: backdrop,
            start: "top top",
            end: `+=${viewportHeight}px`,
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;

              gsap.set([background, items], {
                width: gsap.utils.interpolate(initialWidth, viewportWidth, progress),
                height: gsap.utils.interpolate(initialHeight, viewportHeight, progress),
              });

              links.forEach((link, index) => {
                const initialLinkWidth = initialLinksWidths[index];
                if (initialLinkWidth === undefined) return;

                gsap.set(link, {
                  width: gsap.utils.interpolate(link.offsetWidth, initialLinkWidth, progress),
                });
              });

              flip?.progress(progress);
            },
          });
        }, background);
      };

      const rebuild = () => {
        teardown();
        build();
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      };

      const handleResize = () => {
        if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (!cancelled) rebuild();
        }, 250);
      };

      window.addEventListener("resize", handleResize);
      build();
      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      return () => {
        cancelled = true;
        if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", handleResize);
        teardown();
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <>
      <div className="navbar-backdrop" ref={backdropRef}>
        <div className="navbar-img">
          <img
            src={config.navbarImage}
            alt=""
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
        <div className="navbar-background" ref={backgroundRef} />
      </div>
      <div className="navbar-items" ref={itemsRef} role="navigation" aria-label="Primary">
        {config.navLinks.map((group, groupIndex) => (
          <div
            className="navbar-links"
            key={groupIndex}
            ref={(element) => {
              linksRef.current[groupIndex] = element;
            }}
          >
            {group.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        ))}
        <div className="navbar-logo" ref={logoRef}>
          <a href="/" aria-label="Home">
            <span className="wordmark navbar-wordmark" aria-hidden="true">
              {Array.from(config.brand).map((letter, index) => (
                <span
                  className={index < 6 ? "navbar-wordmark-people" : "navbar-wordmark-com"}
                  key={`${letter}-${index}`}
                >
                  {letter}
                </span>
              ))}
            </span>
          </a>
        </div>
      </div>
      <section className="hero-headline" ref={headlineRef}>
        <h1>{config.headline}</h1>
      </section>
      {showAbout && (
        <section className="about" ref={aboutRef}>
          <h1>{config.aboutLine}</h1>
        </section>
      )}
    </>
  );
}
