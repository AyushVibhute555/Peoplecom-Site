import {ReactLenis,useLenis,type LenisRef} from 'lenis/react';
import {useEffect,useRef,type ReactNode} from 'react';
import {gsap} from 'gsap';
export function SmoothScroll({children}:{children:ReactNode}){
 const ref=useRef<LenisRef>(null);useLenis(()=>{import('@/lib/gsap-setup').then(m=>m.setupGSAP().ScrollTrigger.update());});
 useEffect(()=>{const tick=(t:number)=>ref.current?.lenis?.raf(t*1000);gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);return()=>gsap.ticker.remove(tick);},[]);
 return <ReactLenis root ref={ref} options={{autoRaf:false,lerp:0.1,syncTouch:false,anchors:true}}>{children}</ReactLenis>;
}
