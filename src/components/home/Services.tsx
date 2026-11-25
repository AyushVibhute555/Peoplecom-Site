import {useRef,useState,type PointerEvent} from 'react';
import {AnimatePresence,motion,useSpring} from 'motion/react';
import {useGSAP} from '@gsap/react';
import {Plus,Minus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {HOME} from '@/content/home';
import {MEDIA} from '@/content/media';
import {useServicesInteraction} from '@/hooks/useServicesInteraction';
import {useLite} from '@/hooks/useMotionPreference';
import {MaskLines,SceneHeading} from './Primitives';

function ServiceVisual({id,reduced}:{id:string;reduced:boolean}){
  const media=MEDIA[id];
  if(!media)return null;
  return <figure className="service-visual">
    {media.video&&!reduced?<video src={media.video} poster={media.src} autoPlay muted loop playsInline aria-label={media.alt}/>:media.src?<img src={media.src} alt={media.alt} width={1067} height={1600} loading="lazy" decoding="async" data-zoom={!reduced}/>:<div className="service-visual-placeholder">{!import.meta.env.PROD&&<span>{HOME.labels.placeholder}<br/>{media.alt}</span>}</div>}
  </figure>;
}

export function Services(){
  const {active,dispatch,touch,reduced}=useServicesInteraction();
  const lite=useLite();
  const section=useRef<HTMLElement>(null);
  const x=useSpring(0,{stiffness:240,damping:28});
  const y=useSpring(0,{stiffness:240,damping:28});
  const cursorX=useSpring(0,{stiffness:400,damping:35});
  const cursorY=useSpring(0,{stiffness:400,damping:35});
  const [pointer,setPointer]=useState(false);
  const preview=active===null?null:HOME.services[active];
  useGSAP((_context,contextSafe)=>{
    if(reduced||!contextSafe)return;
    let alive=true;
    const safe=contextSafe;
    const start=safe(()=>{
      void import('@/lib/gsap-setup').then(safe(m=>{
        if(!alive)return;
        const {gsap,ScrollTrigger}=m.setupGSAP();
        gsap.utils.toArray<HTMLElement>('.service-hairline',section.current).forEach((line,i)=>{
          gsap.fromTo(line,{scaleX:0},{scaleX:1,duration:.8,delay:i*.06,ease:'expo.out',scrollTrigger:{trigger:line,start:'top 92%',once:true}});
        });
        void document.fonts.ready.then(()=>{if(alive)ScrollTrigger.refresh();});
      }));
    });
    start();return()=>{alive=false;};
  },{scope:section,dependencies:[reduced],revertOnUpdate:true});

  function position(px:number,py:number,snap=false){
    const left=Math.max(16,Math.min(innerWidth-256,px+28));
    const top=Math.max(16,Math.min(innerHeight-316,py+28));
    if(snap||reduced||lite){x.jump(left);y.jump(top);}else{x.set(left);y.set(top);}
    cursorX.set(px+12);cursorY.set(py-36);
  }
  function move(event:PointerEvent<HTMLButtonElement>,i:number){
    if(touch||event.pointerType==='touch')return;
    setPointer(true);position(event.clientX,event.clientY,active===null);dispatch({type:'activate',index:i});
  }
  return <section ref={section} id="services" data-theme="ink" data-touch={touch} data-reduced={reduced} className="section services-scene">
    <div className="container"><SceneHeading number="02" label={HOME.labels.services}/></div>
    <div className="service-list" onPointerLeave={()=>{setPointer(false);if(!section.current?.contains(document.activeElement))dispatch({type:'clear'});}}>
      {HOME.services.map((service,i)=><div className="service-list-row" data-active={active===i} key={service.media}>
        <span className="service-hairline" aria-hidden="true"/>
        <Button variant="ghost" className="service-trigger" aria-label={service.title} aria-expanded={active===i} aria-controls={`service-panel-${i}`} aria-describedby={touch?undefined:`service-copy-${i}`}
          onPointerMove={e=>move(e,i)}
          onFocus={e=>{if(touch)return;setPointer(false);const rect=e.currentTarget.getBoundingClientRect();position(rect.right-268,rect.top>=332?rect.top-344:rect.bottom,true);dispatch({type:'activate',index:i});}}
          onBlur={e=>{if(!touch&&!section.current?.contains(e.relatedTarget))dispatch({type:'clear'});}}
          onClick={()=>dispatch({type:touch?'toggle':'activate',index:i})}>
          <span className="service-index mono">{String(i+1).padStart(2,'0')}</span>
          <span className="service-name-wrap"><MaskLines className="service-name-mask" delay={i*.06}><span className="service-name">{i===5?<>Employer Branding &<br/>Internal Communication</>:service.title}</span></MaskLines></span>
          <span id={`service-copy-${i}`} className="service-description">{service.copy}</span>
          <span className="service-toggle" aria-hidden="true">{active===i?<Minus/>:<Plus/>}</span>
        </Button>
        <AnimatePresence initial={false} mode="wait">
          {touch&&active===i&&<motion.div id={`service-panel-${i}`} key={service.media} className="service-panel" role="region" aria-label={service.title}
            initial={reduced?false:{height:0,opacity:0}} animate={{height:'auto',opacity:1}} transition={{duration:reduced?0:.45,ease:[.16,1,.3,1]}}>
            <div className="service-panel-inner"><p>{service.copy}</p><ServiceVisual id={service.media} reduced={reduced}/></div>
          </motion.div>}
        </AnimatePresence>
        {!touch&&<div id={`service-panel-${i}`} className="sr-only">{service.copy}</div>}
      </div>)}
    </div>
    {!touch&&<motion.div className="service-preview" aria-hidden="true" style={{x,y}} initial={false} animate={{clipPath:preview?'inset(0% 0% 0% 0%)':'inset(100% 0% 0% 0%)'}} transition={{duration:reduced?0:.5,ease:[.76,0,.24,1]}}>
      {preview&&<ServiceVisual key={preview.media} id={preview.media} reduced={reduced}/>}
    </motion.div>}
    {!touch&&!reduced&&!lite&&active!==null&&pointer&&<motion.span className="service-cursor mono" aria-hidden="true" style={{x:cursorX,y:cursorY}}>{HOME.serviceOpen}</motion.span>}
  </section>;
}