import {describe,expect,it} from 'vitest';
import {serviceInteraction} from '@/hooks/useServicesInteraction';
describe('Services interaction',()=>{
  it('keeps one of the six touch rows open at a time',()=>{
    let state:number|null=null;
    state=serviceInteraction(state,{type:'toggle',index:0});
    expect(state).toBe(0);
    state=serviceInteraction(state,{type:'toggle',index:5});
    expect(state).toBe(5);
    state=serviceInteraction(state,{type:'toggle',index:5});
    expect(state).toBe(null);
  });
  it('uses the same single active row for pointer and keyboard previews',()=>{
    expect(serviceInteraction(0,{type:'activate',index:1})).toBe(1);
    expect(serviceInteraction(1,{type:'clear'})).toBe(null);
  });
});