import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HOME } from "@/content/home";
import { NavbarReveal } from "./NavbarReveal";
import { SpotlightCards } from "./SpotlightCards";
import "./HeroSequence.css";

gsap.registerPlugin(ScrollTrigger, Flip);

// The homepage SmoothScroll provider owns Lenis and its ScrollTrigger sync.
// Drop the image files into public/ with these names, or change this config.
export const HERO_CONFIG = {
  navbarImage: "/navbar-img.jpg",
  brand: HOME.brand,
  navLinks: [
    [
      { label: "Work", href: "/work" },
      { label: "Approach", href: "/#way" },
    ],
    [
      { label: "About", href: "/#manifesto" },
      { label: "Journal", href: "/journal" },
      { label: "Let’s talk", href: "/contact" },
    ],
  ],
  headline: "Designing movement beyond fixed frames and rigid form",
  aboutLine: "The frame dissolves, but the movement continues forward",
  spotlight: {
    title: "The Art of Michelangelus",
    text: "A curated collection of timeless works, reimagined through modern craft and digital precision.",
    images: ["/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg"],
  },
} as const;

type HeroSequenceProps = {
  showAbout?: boolean;
  reducedMotion?: boolean;
};

export function HeroSequence({ showAbout = false, reducedMotion = false }: HeroSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const backdrop = backdropRef.current;
      if (!root || !backdrop) return;

      let trigger: ReturnType<typeof ScrollTrigger.create> | undefined;

      const refresh = () => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      };

      const context = gsap.context(() => {
        trigger = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          onLeave: () => {
            backdrop.style.visibility = "hidden";
          },
          onEnterBack: () => {
            backdrop.style.visibility = "";
          },
        });
      }, root);

      refresh();
      window.addEventListener("load", refresh, { once: true });

      return () => {
        window.removeEventListener("load", refresh);
        trigger?.kill();
        context.revert();
        backdrop.style.visibility = "";
      };
    },
    { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <div className="hero-sequence" data-reduced={reducedMotion} ref={rootRef}>
      <NavbarReveal
        config={HERO_CONFIG}
        backdropRef={backdropRef}
        showAbout={showAbout}
        reducedMotion={reducedMotion}
      />
      <SpotlightCards config={HERO_CONFIG.spotlight} reducedMotion={reducedMotion} />
    </div>
  );
}
