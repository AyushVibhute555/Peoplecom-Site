import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { FAVICON } from "@/content/media";
import "./Preloader.css";

// Drop the four item images into public/preloader, or edit this object. Square transparent cutouts work best.
export const PRELOADER_CONFIG = {
  logo: FAVICON,
  items: [
    "/preloader/item-1.png",
    "/preloader/item-2.png",
    "/preloader/item-3.png",
    "/preloader/item-4.png",
  ],
  colors: {
    ink: "var(--ink, #0A1418)",
    paper: "var(--paper, #F3F0E8)",
    teal: "var(--teal, #00A6BE)",
    signal: "var(--signal, #FF4B2B)",
  },
} as const;

const itemTargets = [
  { x: "-20vw", y: "-30vh", rotation: -20 },
  { x: "25vw", y: "-20vh", rotation: 15 },
  { x: "-32vw", y: "30vh", rotation: 12 },
  { x: "15vw", y: "25vh", rotation: -15 },
];

const EXIT_DISTANCE = 3.5;
const itemExits = itemTargets.map((target) => ({
  x: parseFloat(target.x) * EXIT_DISTANCE + "vw",
  y: parseFloat(target.y) * EXIT_DISTANCE + "vh",
  rotation: target.rotation * 2.5,
}));

type PreloaderProps = {
  ready: boolean;
  reduced: boolean;
  onRevealStart?: () => void;
  onComplete?: () => void;
};

type PreloaderStyle = CSSProperties & {
  "--pl-ink": string;
  "--pl-paper": string;
  "--pl-teal": string;
  "--pl-signal": string;
};

export function Preloader({ ready, reduced, onRevealStart, onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onRevealStart, onComplete });
  callbacks.current = { onRevealStart, onComplete };
  const revealStarted = useRef(false);
  const completed = useRef(false);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    rootRef.current
      ?.querySelectorAll<HTMLImageElement>(".pl-item img, .pl-logo img")
      .forEach((image) => {
        if (image.complete && image.naturalWidth === 0) {
          image.parentElement?.classList.add("is-missing");
        }
      });

    if (!ready || completed.current) return;

    let minimum = 1200;
    try {
      if (sessionStorage.getItem("peoplecom-roll")) minimum = 400;
      sessionStorage.setItem("peoplecom-roll", "1");
    } catch {
      // Storage may be disabled; the animation still runs normally.
    }

    let alive = true;
    const floatingTweens: Array<gsap.core.Tween | undefined> = [];
    const startedAt = performance.now();
    let fallbackTimer: number | undefined;
    let minimumTimer: number | undefined;

    const startReveal = () => {
      if (!alive || revealStarted.current) return;
      revealStarted.current = true;
      callbacks.current.onRevealStart?.();
    };

    const complete = () => {
      if (!alive || completed.current) return;
      completed.current = true;
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      if (minimumTimer !== undefined) window.clearTimeout(minimumTimer);
      startReveal();
      callbacks.current.onComplete?.();
      setDone(true);
    };

    if (reduced) {
      startReveal();
      complete();
      return () => {
        alive = false;
      };
    }

    const context = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".pl-item");
      const timeline = gsap.timeline({ delay: 0.5 });

      fallbackTimer = window.setTimeout(complete, 6000);

      timeline.to(".pl-revealer", {
        clipPath: "circle(100% at 50% 50%)",
        duration: 1,
        stagger: 0.25,
        ease: "power2.inOut",
      });
      timeline.set(".pl-revealer", { display: "none" });

      items.forEach((item, index) => {
        const target = itemTargets[index];
        const image = item.querySelector("img");
        if (!target) return;

        timeline.to(
          item,
          {
            x: target.x,
            y: target.y,
            scale: 1,
            rotation: target.rotation,
            duration: 1,
            ease: "power3.out",
            onStart: () => {
              if (!image) return;
              floatingTweens[index] = gsap.to(image, {
                y: gsap.utils.random(-15, -25),
                duration: gsap.utils.random(1.5, 2.5),
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: gsap.utils.random(0, 0.5),
              });
            },
          },
          index === 0 ? "-=0.55" : "<0.075",
        );
      });

      timeline.to(".pl-logo", { scale: 1, opacity: 1, duration: 1, ease: "power3.out" }, "<");
      timeline.to({}, { duration: 1 });
      timeline.add(() => floatingTweens.forEach((tween) => tween?.kill()));

      items.forEach((item, index) => {
        const exit = itemExits[index];
        if (!exit) return;
        timeline.to(
          item,
          {
            x: exit.x,
            y: exit.y,
            scale: 2.5,
            rotation: exit.rotation,
            duration: 0.75,
            ease: "power2.in",
          },
          index === 0 ? ">" : "<0.075",
        );
      });
      timeline.to(".pl-logo", { y: "-120vh", scale: 2.5, duration: 0.75, ease: "power2.in" }, "<");

      timeline.add(startReveal, "-=0.4");
      timeline.set(".pl-bg", { display: "none" }, "<");

      timeline.set(".pl", { display: "none" });
      timeline.add(() => {
        const remaining = minimum - (performance.now() - startedAt);
        if (remaining > 0) {
          minimumTimer = window.setTimeout(complete, remaining);
        } else {
          complete();
        }
      });
    }, rootRef);

    return () => {
      alive = false;
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      if (minimumTimer !== undefined) window.clearTimeout(minimumTimer);
      floatingTweens.forEach((tween) => tween?.kill());
      context?.revert();
    };
  }, [ready, reduced]);

  if (done) return null;

  const style: PreloaderStyle = {
    "--pl-ink": PRELOADER_CONFIG.colors.ink,
    "--pl-paper": PRELOADER_CONFIG.colors.paper,
    "--pl-teal": PRELOADER_CONFIG.colors.teal,
    "--pl-signal": PRELOADER_CONFIG.colors.signal,
  };

  return (
    <div className="pl" ref={rootRef} aria-hidden="true" style={style}>
      <div className="pl-bg" />
      <div className="pl-revealer pl-revealer-1" />
      <div className="pl-revealer pl-revealer-2" />
      <div className="pl-revealer pl-revealer-3" />
      <div className="pl-revealer pl-revealer-4" />
      <div className="pl-items">
        {PRELOADER_CONFIG.items.map((src) => (
          <div className="pl-item" key={src}>
            <img
              src={src}
              alt=""
              onError={(event) => {
                event.currentTarget.parentElement?.classList.add("is-missing");
              }}
            />
          </div>
        ))}
      </div>
      <div className="pl-logo">
        <img
          src={PRELOADER_CONFIG.logo}
          alt=""
          onError={(event) => {
            event.currentTarget.parentElement?.classList.add("is-missing");
          }}
        />
      </div>
    </div>
  );
}
