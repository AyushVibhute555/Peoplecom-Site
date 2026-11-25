import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { HOME } from "@/content/home";
import { MEDIA } from "@/content/media";
import "./JournalCards.css";

const PARALLAX_STRENGTH = 40;

type JournalCard = {
  title: string;
  description: string[];
  thumbImg: string;
  thumbAlt: string;
  href: string;
};

function referenceTweenVars<T extends { overwrite: string }>(vars: T): gsap.TweenVars {
  // GSAP's types omit the reference's custom overwrite labels; preserve them at runtime.
  return vars as unknown as gsap.TweenVars;
}

// Entries have no excerpts, so their existing categories provide the card metadata.
const CARDS: JournalCard[] = HOME.journal.map((entry) => {
  const media = MEDIA[entry.media];
  if (!media) {
    throw new Error(`Missing media record for journal entry "${entry.slug}".`);
  }

  return {
    title: entry.title,
    description: [entry.category],
    thumbImg: media.src,
    thumbAlt: media.alt,
    href: `/journal/${entry.slug}`,
  };
});

type FaceContentProps = {
  card: JournalCard;
  hidden: boolean;
};

function FaceContent({ card, hidden }: FaceContentProps) {
  return (
    <>
      <img className="jc-thumb" src={card.thumbImg} alt={hidden ? "" : card.thumbAlt} />
      <h2 className="jc-title">{card.title}</h2>
      <div className="jc-meta">
        <p className="jc-desc">
          {card.description.map((line, index) => (
            <Fragment key={index}>
              {index > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </p>
        <svg
          className="jc-arrow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="4" y1="12" x2="20" y2="12" />
          <polyline points="14 6 20 12 14 18" />
        </svg>
      </div>
    </>
  );
}

export function JournalCards() {
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const cubeRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    cubeRefs.current.forEach((cardCube, index) => {
      const cardWrapper = cardRefs.current[index];
      if (!cardCube || !cardWrapper) return;

      const cardDepth = parseFloat(getComputedStyle(cardWrapper).getPropertyValue("--card-depth"));
      const rotation = { flip: 0, tiltX: 0, tiltY: 0 };
      let isFlipped = false;

      const render = () => {
        gsap.set(cardCube, {
          rotationX: rotation.flip + rotation.tiltX,
          rotationY: rotation.tiltY,
          z: -cardDepth / 2,
        });
      };

      const handleMouseEnter = () => {
        isFlipped = false;
        const tweenVars = referenceTweenVars({
          flip: 180,
          duration: 0.5,
          ease: "power2.inOut",
          overwrite: "flip",
          onUpdate: render,
          onComplete: () => {
            isFlipped = true;
          },
        });
        gsap.to(rotation, tweenVars);
      };

      const handleMouseLeave = () => {
        isFlipped = false;
        gsap.to(rotation, {
          flip: 0,
          tiltX: 0,
          tiltY: 0,
          duration: 0.6,
          ease: "power3.out",
          overwrite: true,
          onUpdate: render,
        });
      };

      const handleMouseMove = (event: MouseEvent) => {
        if (!isFlipped) return;

        const bounds = cardCube.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;
        const offsetX = (event.clientX - centerX) / bounds.width;
        const offsetY = (event.clientY - centerY) / bounds.height;
        const tweenVars = referenceTweenVars({
          tiltY: offsetX * PARALLAX_STRENGTH,
          tiltX: -offsetY * PARALLAX_STRENGTH,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "tilt",
          onUpdate: render,
        });
        gsap.to(rotation, tweenVars);
      };

      render();
      cardCube.addEventListener("mouseenter", handleMouseEnter);
      cardCube.addEventListener("mouseleave", handleMouseLeave);
      cardCube.addEventListener("mousemove", handleMouseMove);

      cleanups.push(() => {
        cardCube.removeEventListener("mouseenter", handleMouseEnter);
        cardCube.removeEventListener("mouseleave", handleMouseLeave);
        cardCube.removeEventListener("mousemove", handleMouseMove);
        gsap.killTweensOf(rotation);
        gsap.set(cardCube, { clearProps: "all" });
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div className="jc-stage">
      {CARDS.map((card, index) => (
        <a
          className="jc-card"
          href={card.href}
          key={card.href}
          ref={(element) => {
            cardRefs.current[index] = element;
          }}
        >
          <div
            className="jc-cube"
            ref={(element) => {
              cubeRefs.current[index] = element;
            }}
          >
            <div className="jc-face jc-face-front">
              <FaceContent card={card} hidden={false} />
            </div>
            <div className="jc-face jc-face-back" aria-hidden="true">
              <FaceContent card={card} hidden />
            </div>
            <div className="jc-face jc-face-right" />
            <div className="jc-face jc-face-left" />
            <div className="jc-face jc-face-top" />
            <div className="jc-face jc-face-bottom" />
          </div>
        </a>
      ))}
    </div>
  );
}
