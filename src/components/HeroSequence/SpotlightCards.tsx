import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SPOTLIGHT_SCROLL_LENGTH = 10;

type SpotlightConfig = {
  title: string;
  text: string;
  images: readonly string[];
};

type SpotlightCardsProps = {
  config: SpotlightConfig;
  reducedMotion: boolean;
};

type SpotlightMetrics = {
  cardSize: number;
  circleRadius: number;
  expandedWidth: number;
  expandedHeight: number;
  expandOriginX: number;
  expandOriginY: number;
  expandOriginRotation: number;
};

function getMetrics(): SpotlightMetrics {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const circleRadius = viewportWidth < 1000 ? 800 : 1250;

  return {
    cardSize: viewportWidth < 1000 ? 320 : 500,
    circleRadius,
    expandedWidth: viewportWidth - 64,
    expandedHeight: viewportHeight - 64,
    expandOriginX: circleRadius * Math.sin(0.25),
    expandOriginY: circleRadius * (1 - Math.cos(0.25)),
    expandOriginRotation: (0.25 * 180) / Math.PI,
  };
}

export function SpotlightCards({ config, reducedMotion }: SpotlightCardsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const imageRefs = useRef<Array<HTMLImageElement | null>>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const copy = copyRef.current;
      if (!section || !copy) return;

      const totalCards = config.images.length;
      const cards = cardRefs.current.slice(0, totalCards);
      const images = imageRefs.current.slice(0, totalCards);
      let metrics = getMetrics();
      let copyHidden = false;
      let trigger: ReturnType<typeof ScrollTrigger.create> | undefined;

      const render = (progress: number) => {
        const baseAngle = gsap.utils.interpolate(1.5, -1.5, progress);

        if (progress > 0.5 && !copyHidden) {
          copyHidden = true;
          gsap.to(copy, { opacity: 0, duration: 0.3 });
        } else if (progress < 0.5 && copyHidden) {
          copyHidden = false;
          gsap.to(copy, { opacity: 1, duration: 0.3 });
        }

        cards.forEach((card, index) => {
          const image = images[index];
          if (!card || !image) return;

          const angle = baseAngle - index * 0.45;

          if (index === 0 && angle < 0.25) {
            const expandProgress = gsap.utils.clamp(0, 1, (0.25 - angle) / 1.5);
            gsap.set(card, {
              xPercent: -50,
              yPercent: -50,
              x: gsap.utils.interpolate(metrics.expandOriginX, 0, expandProgress),
              y: gsap.utils.interpolate(metrics.expandOriginY, 0, expandProgress),
              rotation: gsap.utils.interpolate(metrics.expandOriginRotation, 0, expandProgress),
              width: gsap.utils.interpolate(
                metrics.cardSize,
                metrics.expandedWidth,
                expandProgress,
              ),
              height: gsap.utils.interpolate(
                metrics.cardSize,
                metrics.expandedHeight,
                expandProgress,
              ),
              borderRadius: gsap.utils.interpolate(10, 20, expandProgress),
            });
            gsap.set(image, {
              scale: gsap.utils.interpolate(1.15, 1, expandProgress),
            });
            return;
          }

          gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
            x: metrics.circleRadius * Math.sin(angle),
            y: metrics.circleRadius * (1 - Math.cos(angle)),
            rotation: (angle * 180) / Math.PI,
            width: metrics.cardSize,
            height: metrics.cardSize,
            borderRadius: 10,
          });
          gsap.set(image, { scale: 1.15 });
        });
      };

      const context = gsap.context(() => {
        images.forEach((image) => {
          if (image) gsap.set(image, { scale: 1.15 });
        });

        render(0);

        if (!reducedMotion) {
          trigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: () => "+=" + window.innerHeight * SPOTLIGHT_SCROLL_LENGTH,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => render(self.progress),
          });
        }
      }, section);

      const handleResize = () => {
        metrics = getMetrics();
        ScrollTrigger.refresh();
        render(trigger?.progress ?? 0);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        trigger?.kill();
        gsap.killTweensOf(copy);
        context.revert();
        const targets = [...cards, ...images, copy].filter(
          (element): element is HTMLDivElement | HTMLImageElement => element !== null,
        );
        gsap.set(targets, { clearProps: "all" });
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <section id="hero" className="spotlight-hero" ref={sectionRef} aria-label={config.title}>
      <div className="spotlight-copy" ref={copyRef}>
        <h1>{config.title}</h1>
        <p>{config.text}</p>
      </div>
      {config.images
        .map((src, index) => ({ src, index }))
        .reverse()
        .map(({ src, index }) => (
          <div
            className="card"
            key={index}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
          >
            <img
              src={src}
              alt=""
              ref={(element) => {
                imageRefs.current[index] = element;
              }}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
        ))}
    </section>
  );
}
