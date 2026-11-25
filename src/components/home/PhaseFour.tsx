import {useEffect,useRef,useState} from 'react';
import {useGSAP} from '@gsap/react';
import {AnimatePresence,motion,useAnimationFrame,useMotionValue,useScroll,useSpring,useVelocity} from 'motion/react';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import {HOME} from '@/content/home';
import {MEDIA} from '@/content/media';
import {Button} from '@/components/ui/button';
import {applyChromeTheme} from '@/lib/chrome-theme';
import {canAutoplay,carouselIndex,permittedLogos,proofCells,publishedQuotes,TESTIMONIAL_FADE,TESTIMONIAL_INTERVAL} from '@/config/proof';
import {useDocumentVisible} from '@/hooks/useDocumentVisible';
import {CountUp,SceneHeading} from './Primitives';

export function Way({reduced}:{reduced:boolean}){
  const wrapper=useRef<HTMLElement>(null);const stage=useRef<HTMLDivElement>(null);
  const [desktop,setDesktop]=useState(false);const [step,setStep]=useState(0);
  useEffect(()=>{const q=matchMedia('(min-width:768px)');const update=()=>setDesktop(q.matches&&!reduced);q.addEventListener('change',update);update();return()=>q.removeEventListener('change',update);},[reduced]);
  useGSAP((_ctx,safe)=>{if(!safe||!desktop)return;let alive=true;let observer:ResizeObserver|undefined;let lastIndex=-1;
    void import('@/lib/gsap-setup').then(safe(m=>{
      if(!alive||!wrapper.current||!stage.current)return;const {gsap,ScrollTrigger}=m.setupGSAP();
      const slides=gsap.utils.toArray<HTMLElement>('.way-slide',wrapper.current);
      const images=gsap.utils.toArray<HTMLElement>('.way-image-layer',wrapper.current);
      const curtains=gsap.utils.toArray<HTMLElement>('.way-colour-cut',wrapper.current);
      const timeline=gsap.timeline({scrollTrigger:{trigger:wrapper.current,start:'top top',end:'bottom bottom',scrub:true,invalidateOnRefresh:true,onUpdate:self=>{
        const index=Math.min(3,Math.floor(self.progress*4));if(index===lastIndex)return;lastIndex=index;setStep(index);
        if(stage.current){stage.current.dataset['theme']=HOME.way[index]?.theme??'paper';applyChromeTheme(stage.current,'05');}
      }}});
      timeline.to('.way-film-progress-fill',{scaleX:1,duration:4,ease:'none'},0);
      for(let i=1;i<4;i++){
        timeline.to('.way-ones-track',{yPercent:-i*25,duration:.18,ease:'expo.out'},i);
        timeline.to(slides[i-1]??null,{opacity:0,duration:.08},i);
        timeline.to(slides[i]??null,{opacity:1,duration:.12},i+.02);
        timeline.to(images[i]??null,{clipPath:'inset(0% 0% 0% 0%)',duration:.18,ease:'power4.inOut'},i);
        timeline.fromTo(curtains[i-1]??null,{visibility:'visible',y:0,yPercent:100},{visibility:'visible',y:0,yPercent:-100,duration:.18,ease:'power4.inOut'},i-.09);
      }
      observer=new ResizeObserver(()=>ScrollTrigger.refresh());observer.observe(stage.current);
      void document.fonts.ready.then(()=>{if(alive)ScrollTrigger.refresh();});
    }));return()=>{alive=false;observer?.disconnect();};
  },{scope:wrapper,dependencies:[desktop],revertOnUpdate:true});
  function jump(i:number){if(!wrapper.current)return;if(desktop)window.scrollTo({top:wrapper.current.offsetTop+(wrapper.current.offsetHeight-innerHeight)*(i+.4)/4,behavior:'smooth'});else wrapper.current.querySelectorAll('.way-slide')[i]?.scrollIntoView({behavior:reduced?'instant':'smooth'});}
  return <section id="way" ref={wrapper} className="way-film" data-desktop={desktop} data-reduced={reduced}>
    <div ref={stage} className="way-film-stage" data-theme="paper">
      <div className="container way-film-heading"><SceneHeading number="05" label={HOME.labels.way}/></div>
      <div className="way-film-numeral" aria-hidden="true"><span>0</span><div className="way-digit-mask"><div className="way-ones-track">{[1,2,3,4].map(n=><span key={n}>{n}</span>)}</div></div></div>
      <ol className="way-slides" aria-label={HOME.labels.way}>
        {HOME.way.map((item,i)=><li className="way-slide" key={item.title} data-theme={item.theme} data-chrome-ignore={desktop||undefined} data-active={step===i}>
          <div className="way-mobile-heading"><SceneHeading number="05" label={HOME.labels.way}/><span className="way-static-number" aria-hidden="true">0{i+1}</span></div>
          <div className="way-slide-copy"><h2>{item.title}</h2><p>{item.copy}</p></div>
          <figure className="way-static-image"><img src={MEDIA[item.media]?.src} alt={MEDIA[item.media]?.alt} width={1067} height={1600} loading="lazy" decoding="async"/></figure>
        </li>)}
      </ol>
      <div className="way-film-images" aria-hidden="true">{HOME.way.map((item,i)=><figure className="way-image-layer" key={item.media} data-initial={i===0}><img src={MEDIA[item.media]?.src} alt="" width={1067} height={1600} loading="lazy" decoding="async"/></figure>)}</div>
      <div className="way-film-progress"><div className="way-film-progress-line"><span className="way-film-progress-fill"/></div><div>{HOME.way.map((item,i)=><Button key={item.title} variant="ghost" aria-label={`Step ${i+1}: ${item.title}`} aria-pressed={step===i} onClick={()=>jump(i)}><span/></Button>)}</div></div>
      {HOME.way.slice(1).map(item=><div key={item.theme} className={`way-colour-cut way-cut-${item.theme}`} aria-hidden="true"/>)}
    </div>
  </section>;
}

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