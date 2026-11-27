import {useEffect,useRef,useState} from 'react';
import {AnimatePresence,motion,useAnimationFrame,useMotionValue,useScroll,useSpring,useVelocity} from 'motion/react';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import {HOME} from '@/content/home';
import {MEDIA} from '@/content/media';
import {Button} from '@/components/ui/button';
import {canAutoplay,carouselIndex,permittedLogos,proofCells,publishedQuotes,TESTIMONIAL_FADE,TESTIMONIAL_INTERVAL} from '@/config/proof';
import {useDocumentVisible} from '@/hooks/useDocumentVisible';
import {CountUp,SceneHeading} from './Primitives';

function ProofMarquee({reduced}:{reduced:boolean}){
  const logos=permittedLogos(HOME.clients);const group=useRef<HTMLDivElement>(null);const width=useRef(1);const x=useMotionValue(0);
  const {scrollY}=useScroll();const velocity=useVelocity(scrollY);const speed=useSpring(velocity,{stiffness:100,damping:28});
  const direction=useRef(-1);const [hover,setHover]=useState(false);const [focus,setFocus]=useState(false);const tabVisible=useDocumentVisible();
  useEffect(()=>{if(!group.current)return;const measure=()=>{width.current=group.current?.scrollWidth??1;};measure();const ro=new ResizeObserver(measure);ro.observe(group.current);return()=>ro.disconnect();},[logos.length]);
  useAnimationFrame((_t,delta)=>{if(reduced||hover||focus||!tabVisible)return;const v=speed.get();if(Math.abs(v)>5)direction.current=v>0?-1:1;let next=x.get()+direction.current*(width.current/60000)*delta*(1+Math.min(Math.abs(v)/3000,.35));next=((next%width.current)+width.current)%width.current-width.current;x.set(next);});
  const items=()=>logos.length?logos.map(logo=><img key={logo.name} src={MEDIA[logo.media]?.src} alt={logo.name} className="client-monochrome" width={180} height={100} loading="lazy" decoding="async"/>):HOME.proof.fallbackNames.map(name=><span key={name}>{name}</span>);
  return <div className="proof-marquee" data-reduced={reduced} tabIndex={0} aria-label={HOME.labels.sectors} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}><motion.div style={{x:reduced?0:x}}><div ref={group}>{items()}</div><div aria-hidden="true">{items()}</div></motion.div></div>;
}
export function Proof({reduced}:{reduced:boolean}){return <section id="proof" data-theme="ink" className="section proof-film"><div className="container"><SceneHeading label={HOME.labels.proof}/><div className="proof-cells">{proofCells().map(cell=><div className="proof-cell" key={cell.id}>{cell.placeholder&&<span className="proof-placeholder mono">{HOME.labels.placeholder}</span>}<p className="proof-number">{cell.static?cell.value:<CountUp value={Number(cell.value)} reduced={reduced} duration={1.6}/>}</p><p>{cell.label}</p></div>)}</div></div><ProofMarquee reduced={reduced}/></section>;}

export function Testimonials({reduced}:{reduced:boolean}){
  const quotes=publishedQuotes(HOME.testimonials);const [index,setIndex]=useState(0);const [hover,setHover]=useState(false);const [focus,setFocus]=useState(false);const tabVisible=useDocumentVisible();
  const active=quotes[index%Math.max(1,quotes.length)];const advance=(direction:number)=>setIndex(i=>carouselIndex(i,direction,quotes.length));
  useEffect(()=>{if(!canAutoplay(reduced,hover||focus,tabVisible,quotes.length))return;const timer=setInterval(()=>setIndex(i=>carouselIndex(i,1,quotes.length)),TESTIMONIAL_INTERVAL);return()=>clearInterval(timer);},[reduced,hover,focus,tabVisible,quotes.length]);
  if(!active)return null;
  return <section id="testimonials" data-theme="teal" className="section testimonials-film" aria-roledescription="carousel" aria-label={HOME.testimonialLabels.quotes} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setFocus(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocus(false);}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();advance(1);}if(e.key==='ArrowLeft'){e.preventDefault();advance(-1);}}}>
    <div className="container"><SceneHeading label={HOME.labels.testimonials}/><div className="testimonial-stage" aria-live={focus?'polite':'off'}>
      <AnimatePresence initial={false}><motion.figure key={active.id} className="testimonial-layer" initial={{opacity:reduced?1:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:TESTIMONIAL_FADE}}>
        {active.placeholder&&<span className="testimonial-placeholder mono">{HOME.labels.placeholder}</span>}
        <blockquote>{active.quote}</blockquote><figcaption><span>{active.name}</span><span>{active.role} / {active.brand}</span></figcaption>
      </motion.figure></AnimatePresence></div>
      <div className="testimonial-controls"><Button variant="ghost" aria-label={HOME.testimonialLabels.previous} disabled={quotes.length<2} onClick={()=>advance(-1)}><ArrowLeft/></Button><div className="testimonial-dots">{quotes.map((q,i)=><Button key={q.id} variant="ghost" aria-label={`${HOME.testimonialLabels.select} ${i+1}`} aria-pressed={index===i} onClick={()=>setIndex(i)}><span/></Button>)}</div><Button variant="ghost" aria-label={HOME.testimonialLabels.next} disabled={quotes.length<2} onClick={()=>advance(1)}><ArrowRight/></Button></div>
    </div>
  </section>;
}