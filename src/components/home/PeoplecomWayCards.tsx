import { useLayoutEffect, useRef } from "react";
import { HOME } from "@/content/home";
import { MEDIA } from "@/content/media";
import { applyChromeTheme } from "@/lib/chrome-theme";
import { SceneHeading } from "./Primitives";
import "./PeoplecomWayCards.css";

const FAN_POSES = [
  { x: -490, y: -45, rotation: 4 },
  { x: -270, y: 5, rotation: -5 },
  { x: -60, y: -75, rotation: 5 },
  { x: 210, y: -65, rotation: -8 },
] as const;
const COLLAPSED_POSES = [
  { x: -24, y: 0, rotation: -2 },
  { x: -8, y: 5, rotation: -1 },
  { x: 8, y: -4, rotation: 1 },
  { x: 24, y: 8, rotation: 2 },
] as const;

function navbarHeight() {
  if (window.innerWidth <= 720) return 145;
  const wordmarkHeight = Math.min(64, Math.max(40, window.innerWidth * 0.05));
  return Math.max(56, wordmarkHeight - 4);
}

export function PeoplecomWayCards({ reduced }: { reduced: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper || reduced) return;

    let alive = true;
    let revertContext: (() => void) | undefined;
    let trigger: import("gsap/ScrollTrigger").ScrollTrigger | undefined;
    let dispose: (() => void) | undefined;
    let resizeTimer = 0;
    let lastWidth = window.innerWidth;
    let lastThemeIndex = -1;
    let mobile = window.matchMedia("(max-width: 767px)").matches;
    const hoverAvailable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cards = cardsRef.current.filter((card): card is HTMLElement => card !== null);

    const setTheme = (index: number) => {
      const theme = HOME.way[index]?.theme;
      if (!theme) return;
      if (lastThemeIndex === index && section.dataset["theme"] === theme) return;
      lastThemeIndex = index;
      section.dataset["theme"] = theme;
      applyChromeTheme(section);
    };

    void import("@/lib/gsap-setup").then(({ setupGSAP }) => {
      if (!alive) return;
      const { gsap, ScrollTrigger } = setupGSAP();

      const build = () => {
        trigger?.kill();
        gsap.killTweensOf(cards);
        revertContext?.();
        revertContext = undefined;
        mobile = window.matchMedia("(max-width: 767px)").matches;
        section.dataset["mobile"] = String(mobile);

        const context = gsap.context(() => {
          if (mobile) {
            const viewportHeight = () => window.innerHeight;
            const paintStack = (progress: number, active: boolean) => {
              const normalizedProgress = Math.max(0, Math.min(1, progress));
              const atEnd = normalizedProgress >= 0.999;
              const step = atEnd ? cards.length - 1 : normalizedProgress * (cards.length - 1);
              const activeIndex = atEnd
                ? cards.length - 1
                : Math.min(cards.length - 1, Math.floor(step));
              if (active || atEnd) setTheme(activeIndex);

              cards.forEach((card, index) => {
                if (index < step) {
                  const exitProgress = Math.min(1, step - index);
                  gsap.set(card, {
                    xPercent: -50,
                    yPercent: -50,
                    x: 0,
                    y: -exitProgress * (viewportHeight() + 460),
                    rotation: -exitProgress * 8,
                    scale: 1 - exitProgress * 0.08,
                    opacity: 1 - exitProgress,
                    zIndex: cards.length - index,
                  });
                  return;
                }

                const depth = index - step;
                gsap.set(card, {
                  xPercent: -50,
                  yPercent: -50,
                  x: 0,
                  y: depth * 14,
                  rotation: depth * 1.5,
                  scale: 1 - depth * 0.035,
                  opacity: 1,
                  zIndex: cards.length - index,
                });
              });
            };

            trigger = ScrollTrigger.create({
              trigger: wrapper,
              start: () => `top ${navbarHeight()}px`,
              end: () => `+=${window.innerHeight * (cards.length - 1)}`,
              pin: wrapper,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) => paintStack(self.progress, self.isActive),
              onRefresh: (self) => paintStack(self.progress, self.isActive),
            });
            paintStack(trigger.progress, trigger.isActive);
            return;
          }

          cards.forEach((card, index) => {
            const pose = COLLAPSED_POSES[index];
            if (!pose) return;
            gsap.set(card, {
              left: "50%",
              top: "50%",
              xPercent: -50,
              yPercent: -50,
              ...pose,
              zIndex: index + 1,
            });
          });
        }, section);
        revertContext = () => context.revert();
      };

      const openFan = () => {
        if (!mobile && hoverAvailable) {
          cards.forEach((card, index) => {
            const pose = FAN_POSES[index];
            if (!pose) return;
            gsap.to(card, {
              ...pose,
              duration: 0.65,
              ease: "power3.out",
              overwrite: "auto",
            });
          });
        }
      };
      const closeFan = () => {
        if (!mobile && hoverAvailable) {
          cards.forEach((card, index) => {
            const pose = COLLAPSED_POSES[index];
            if (!pose) return;
            gsap.to(card, {
              ...pose,
              duration: 0.5,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
          setTheme(0);
        }
      };
      const cardEnterHandlers = cards.map((_, index) => () => {
        if (!mobile && hoverAvailable) setTheme(index);
      });
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (!alive) return;
          if (window.innerWidth !== lastWidth) {
            lastWidth = window.innerWidth;
            build();
          } else {
            ScrollTrigger.refresh();
          }
        }, 150);
      };

      wrapper.addEventListener("pointerenter", openFan);
      wrapper.addEventListener("pointerleave", closeFan);
      cards.forEach((card, index) => {
        const handler = cardEnterHandlers[index];
        if (handler) card.addEventListener("pointerenter", handler);
      });
      window.addEventListener("resize", onResize);
      build();

      dispose = () => {
        alive = false;
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        wrapper.removeEventListener("pointerenter", openFan);
        wrapper.removeEventListener("pointerleave", closeFan);
        cards.forEach((card, index) => {
          const handler = cardEnterHandlers[index];
          if (handler) card.removeEventListener("pointerenter", handler);
        });
        trigger?.kill();
        gsap.killTweensOf(cards);
        revertContext?.();
      };
    });

    return () => {
      alive = false;
      dispose?.();
    };
  }, [reduced]);

  return (
    <section id="way" ref={sectionRef} className="pw-way" data-theme="paper" data-reduced={reduced}>
      <div className="pw-way-heading">
        <SceneHeading number="05" label={HOME.labels.way} />
      </div>
      <div ref={wrapperRef} className="pw-cards-wrapper">
        {HOME.way.map((item, index) => {
          const media = MEDIA[item.media];
          return (
            <article
              className="pw-card"
              data-theme={item.theme}
              data-chrome-ignore={!reduced || undefined}
              key={item.title}
              ref={(element) => {
                cardsRef.current[index] = element;
              }}
            >
              <span className={`pw-card-sticker pw-card-sticker-${index + 1}`}>
                STICKER / 0{index + 1}
              </span>
              <p className="pw-card-index mono">0{index + 1} / 04</p>
              <h2 className="pw-card-title">{item.title}</h2>
              <p className="pw-card-copy">{item.copy}</p>
              {media?.src && (
                <figure className="pw-card-media">
                  <img
                    src={media.src}
                    alt={media.alt}
                    width={1067}
                    height={1600}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
