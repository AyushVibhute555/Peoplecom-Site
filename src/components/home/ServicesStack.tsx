import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HOME } from "@/content/home";
import { useCoarsePointer, useMotionPreference } from "@/hooks/useMotionPreference";
import { SceneHeading } from "./Primitives";
import "./ServicesStack.css";

gsap.registerPlugin(ScrollTrigger);

// Drop real images into public/services/ with these names, or edit the image paths below.
const PEEK = 42;
const SCALE_STEP = 0.045;

function stackPose(index: number) {
  return {
    y: index * PEEK,
    scale: 1 - index * SCALE_STEP,
  };
}

export function ServicesStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<Array<HTMLElement | null>>([]);
  const { reduced } = useMotionPreference();
  const touch = useCoarsePointer();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter((card): card is HTMLElement => card !== null);
    if (!section) return;

    if (reduced) {
      gsap.set(cards, { clearProps: "all" });
      return () => {
        gsap.set(cards, { clearProps: "all" });
      };
    }

    const context = gsap.context(() => {
      cards.forEach((card, index) => {
        gsap.set(card, {
          zIndex: cards.length - index,
          y: window.innerHeight * 0.72 + index * PEEK,
          scale: stackPose(index).scale * 0.9,
          rotate: 0,
          transformOrigin: "50% 0%",
        });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${cards.length * window.innerHeight}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, index) => {
        timeline.to(
          card,
          { ...stackPose(index), ease: "power3.out", duration: 1.35 },
          index * 0.06,
        );
      });

      timeline.to({}, { duration: 0.35 });

      const flyAt = timeline.duration();
      const flying = cards.slice(0, -1);

      flying.forEach((card, index) => {
        const time = flyAt + index;
        const behind = cards.slice(index + 1);

        timeline.to(
          card,
          {
            y: () => -window.innerHeight * 1.15,
            rotate: -25,
            scale: 0.94,
            ease: "none",
            duration: 1,
          },
          time,
        );

        timeline.to(
          behind,
          {
            y: (cardIndex) => stackPose(cardIndex).y,
            scale: (cardIndex) => stackPose(cardIndex).scale,
            ease: "none",
            duration: 1,
          },
          time,
        );
      });

      timeline.to({}, { duration: 0.4 });
    }, section);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", handleResize);
      context.revert();
      gsap.set(cards, { clearProps: "all" });
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="services"
      data-theme="ink"
      data-touch={touch}
      data-reduced={reduced}
      className={`section services-scene sv-stack${reduced ? " is-static" : ""}`}
    >
      <div className="container sv-header">
        <SceneHeading number="02" label={HOME.labels.services} />
      </div>
      <div className="sv-stage">
        <div className="sv-deck">
          {HOME.services.map((service, index) => (
            <article
              className="sv-card"
              data-tone={(index % 4) + 1}
              key={service.media}
              ref={(card) => {
                cardsRef.current[index] = card;
              }}
            >
              <div className="sv-card__content">
                <div className="sv-card__top">
                  <h3 className="sv-card__title">
                    {service.title === "Employer Branding & Internal Communication" ? (
                      <>
                        Employer Branding &<br />
                        Internal Communication
                      </>
                    ) : (
                      service.title
                    )}
                  </h3>
                  <span className="sv-card__index">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <p className="sv-card__lede">{service.copy}</p>
              </div>
              <div className="sv-card__media">
                <div className="sv-card__frame">
                  <img
                    src={`/services/service-${index + 1}.jpg`}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.parentElement?.classList.add("is-missing");
                    }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
