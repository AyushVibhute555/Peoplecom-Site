import {useEffect,useReducer,useState} from 'react';

export type ServiceAction = {type:'activate';index:number} | {type:'toggle';index:number} | {type:'clear'};
export function serviceInteraction(state:number|null,action:ServiceAction):number|null {
  if(action.type==='clear')return null;
  if(action.type==='toggle'&&state===action.index)return null;
  return action.index;
}
export function useServicesInteraction(){
  const [active,dispatch]=useReducer(serviceInteraction,null);
  const [touch,setTouch]=useState(false);
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{
    const query=matchMedia('(max-width: 767px), (pointer: coarse)');
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>{
      setTouch(query.matches);
      setReduced(motion.matches||document.documentElement.dataset['motion']==='reduced');
    };
    const observer=new MutationObserver(update);
    observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});
    query.addEventListener('change',update);motion.addEventListener('change',update);update();
    return()=>{observer.disconnect();query.removeEventListener('change',update);motion.removeEventListener('change',update);};
  },[]);
  return {active,dispatch,touch,reduced};
}