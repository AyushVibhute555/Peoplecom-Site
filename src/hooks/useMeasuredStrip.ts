import {useEffect,useRef,useState} from 'react';
import {animate,useMotionValue,type AnimationPlaybackControls} from 'motion/react';
export function useMeasuredStrip(reduced:boolean){
 const viewport=useRef<HTMLDivElement>(null);const track=useRef<HTMLDivElement>(null);const [distance,setDistance]=useState(0);const [step,setStep]=useState(400);const target=useMotionValue(0);const control=useRef<AnimationPlaybackControls|undefined>(undefined);
 useEffect(()=>{const outer=viewport.current;const inner=track.current;if(!outer||!inner)return;const measure=()=>{const max=Math.max(0,inner.scrollWidth-outer.clientWidth);setDistance(max);setStep((inner.firstElementChild?.getBoundingClientRect().width??376)+24);target.set(Math.max(-max,Math.min(0,target.get())));};measure();const observer=new ResizeObserver(measure);observer.observe(outer);observer.observe(inner);return()=>observer.disconnect();},[target]);
 useEffect(()=>()=>control.current?.stop(),[]);
 const move=(direction:number)=>{control.current?.stop();const next=Math.max(-distance,Math.min(0,target.get()-direction*step));if(reduced)target.set(next);else control.current=animate(target,next,{type:'spring',stiffness:170,damping:28});};
 return {viewport,track,distance,target,x:target,move};
}