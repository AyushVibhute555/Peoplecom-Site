import {useRef,useState} from 'react';
import {useGSAP} from '@gsap/react';
import {ArrowDown,Play,Square} from 'lucide-react';
import {useLenis} from 'lenis/react';
import {Button} from '@/components/ui/button';
import {WipeButton} from './Primitives';
import {HOME} from '@/content/home';
import {MEDIA,FAVICON} from '@/content/media';
import {timecode} from '@/config/frames';
import {drawStoryboard,loadFrames} from '@/lib/frame-sequence';
export function Hero({reduced,onReady}:{reduced:boolean;onReady:()=>void}){const track=useRef<HTMLElement>(null);const canvas=useRef<HTMLCanvasElement>(null);const [progress,setProgress]=useState(0);const [painted,setPainted]=useState(false);const [playing,setPlaying]=useState(false);const lenis=useLenis();const playback=useRef<ReturnType<typeof setTimeout>|null>(null);const stopRef=useRef<()=>void>(()=>{});const time=useRef<HTMLSpanElement>(null);const counter=useRef<HTMLSpanElement>(null);const fill=useRef<HTMLDivElement>(null);
 useGSAP((_scope,safe)=>{
  if(reduced){onReady();return;}if(!safe||!canvas.current||!track.current)return;
  const c=canvas.current;const ctx=c.getContext('2d');if(!ctx){onReady();return;}
  const abort=new AbortController();let alive=true;let cleanup=()=>{};
  void import('@/lib/gsap-setup').then(safe(async m=>{
   if(!alive)return;const {gsap,ScrollTrigger}=m.setupGSAP();let target=0;let current=-1;let width=1;let height=1;let lastBeat=-1;let fallback=true;let images=new Map<number,HTMLImageElement>();let count=180;
   const css=getComputedStyle(document.documentElement);const palette=Object.fromEntries(['paper','teal','ink','yellow','signal'].map(k=>[k,css.getPropertyValue(`--${k}`).trim()]));const logo=new Image();logo.src=FAVICON;
   const draw=()=>{const image=images.get(Math.round(target*(count-1))+1);if(!fallback&&image){const scale=Math.max(width/image.width,height/image.height);ctx.drawImage(image,(width-image.width*scale)/2,(height-image.height*scale)/2,image.width*scale,image.height*scale);}else drawStoryboard(ctx,width,height,target,palette,logo.complete?logo:null);};
   const resize=()=>{const r=c.getBoundingClientRect();width=r.width;height=r.height;const d=Math.min(devicePixelRatio,width<768?1.25:1.5);c.width=width*d;c.height=height*d;ctx.setTransform(d,0,0,d,0,0);draw();};resize();const observer=new ResizeObserver(resize);observer.observe(c);
   const trigger=ScrollTrigger.create({trigger:track.current,start:'top top',end:'bottom bottom',onUpdate:self=>{target=self.progress;const beat=target<.1?0:target<.4?1:target<.75?2:3;if(beat!==lastBeat){lastBeat=beat;setProgress(target);}if(time.current)time.current.textContent=timecode(target*7.5);if(counter.current)counter.current.textContent=`FR ${String(Math.round(target*179)+1).padStart(4,'0')} / 0180`;if(fill.current)fill.current.style.transform=`scaleX(${target})`;}});
   const tick=()=>{if(!alive||Math.abs(target-current)<.0001)return;current=target;draw();};gsap.ticker.add(tick);draw();setPainted(true);onReady();
   const cancel=()=>stopRef.current();window.addEventListener('wheel',cancel,{passive:true});window.addEventListener('touchstart',cancel,{passive:true});window.addEventListener('pointerdown',cancel);window.addEventListener('keydown',cancel);
   cleanup=()=>{observer.disconnect();trigger.kill();gsap.ticker.remove(tick);if(playback.current)clearTimeout(playback.current);window.removeEventListener('wheel',cancel);window.removeEventListener('touchstart',cancel);window.removeEventListener('pointerdown',cancel);window.removeEventListener('keydown',cancel);};
   const result=await loadFrames(innerWidth<768,()=>{},abort.signal);if(alive){images=result.images;count=result.set.count;fallback=result.fallback;current=-1;draw();}
   void document.fonts.ready.then(()=>{if(alive)ScrollTrigger.refresh();});
  }));return()=>{alive=false;abort.abort();cleanup();};
 },{scope:track,dependencies:[reduced,onReady],revertOnUpdate:true});
 function stop(){if(playback.current)clearTimeout(playback.current);lenis?.scrollTo(window.scrollY,{immediate:true});setPlaying(false);}stopRef.current=()=>{if(playing)stop();};
 function play(){if(playing){stop();return;}const el=track.current;if(!el)return;setPlaying(true);const end=el.offsetTop+el.offsetHeight-innerHeight;if(lenis)lenis.scrollTo(end,{duration:9,easing:t=>t,onComplete:()=>setPlaying(false)});else window.scrollTo({top:end,behavior:reduced?'instant':'smooth'});playback.current=setTimeout(()=>setPlaying(false),9000);}
 const beat=progress<.1?0:progress<.4?1:progress<.75?2:3;
 return <section id="hero" data-theme="ink" ref={track} className="hero-track"><div className="hero-stage"><div className="hero-art" data-painted={painted}><img className="hero-poster" src={MEDIA['poster-hero']?.src} alt={MEDIA['poster-hero']?.alt} width={1600} height={900} fetchPriority="high"/><canvas ref={canvas} aria-hidden="true"/></div><div className="hero-meta" aria-label="Peoplecom · Brand & Creative Agency · Bengaluru"><span>Peoplecom</span><span>{HOME.agency}</span><span>{HOME.city}</span></div><div className="film-controls"><Button variant="ghost" onClick={play} disabled={reduced}>{playing?<Square size={12}/>:<Play size={12}/>} {playing?HOME.stop:HOME.play}</Button><Button variant="ghost" onClick={()=>{stop();document.getElementById('manifesto')?.scrollIntoView({behavior:reduced?'instant':'smooth'});}}>{HOME.skip}<ArrowDown size={12}/></Button></div><div className="hero-captions">{HOME.hero.map((text,i)=>i===0?<h1 key={text} className="hero-caption" data-active={beat===i}><span>{text}</span></h1>:<p key={text} className="hero-caption" data-active={beat===i}><span>{text}</span></p>)}</div><div className="hero-end" data-active={beat===3}><p className="wordmark hero-signature">{HOME.brand}</p></div><div className="hero-actions" data-active={beat===3} inert={!reduced&&progress<=.72}><WipeButton onClick={()=>document.getElementById('work')?.scrollIntoView({behavior:reduced?'instant':'smooth'})}>{HOME.workCta}</WipeButton><WipeButton className="bg-paper text-ink" onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:reduced?'instant':'smooth'})}>{HOME.contactCta}</WipeButton></div><div className="film-folio mono">Frame by frame / A Peoplecom film</div><div className="hero-bottom mono"><span ref={time}>{timecode(progress*7.5)}</span><span className="scroll-cue" data-hidden={progress>.12}>{HOME.scroll}<ArrowDown/></span><span ref={counter}>FR {String(Math.round(progress*179)+1).padStart(4,'0')} / 0180</span></div><div className="hero-progress" ref={fill}/></div></section>;
}
