import {useEffect,useRef,useState} from 'react';
export function useMotionPreference() {
 const [reduced,setReduced]=useState(false); const [ready,setReady]=useState(false);const current=useRef(false);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{let saved:string|null=null;try{saved=localStorage.getItem('peoplecom-motion');}catch{}current.current=q.matches||saved==='Reduced';setReduced(current.current);setReady(true);};update();q.addEventListener('change',update);window.addEventListener('peoplecom:motion',update);return()=>{q.removeEventListener('change',update);window.removeEventListener('peoplecom:motion',update);};},[]);
 function toggle(){const value=!current.current;current.current=value;try{localStorage.setItem('peoplecom-motion',value?'Reduced':'Full');}catch{}setReduced(value);window.dispatchEvent(new Event('peoplecom:motion'));}
 useEffect(()=>{if(ready)document.documentElement.dataset['motion']=reduced?'reduced':'full';},[reduced,ready]);
 return {reduced,toggle,ready};
}
export function useCoarsePointer(){const [coarse,set]=useState(true);useEffect(()=>{const q=matchMedia('(pointer:coarse)');set(q.matches);const fn=()=>set(q.matches);q.addEventListener('change',fn);return()=>q.removeEventListener('change',fn);},[]);return coarse;}
export function useLite(){const [lite,set]=useState(false);useEffect(()=>{const n=navigator as Navigator & {deviceMemory?:number;connection?:{saveData?:boolean}};set((n.deviceMemory??8)<=4||n.hardwareConcurrency<=4||!!n.connection?.saveData);},[]);return lite;}
