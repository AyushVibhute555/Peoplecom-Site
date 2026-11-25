import {act,renderHook,waitFor} from '@testing-library/react';
import {beforeEach,describe,it,expect} from 'vitest';
import {useMotionPreference} from '@/hooks/useMotionPreference';
beforeEach(()=>localStorage.clear());
describe('Motion preference',()=>{
 it('restores the persisted Reduced choice after mount',async()=>{localStorage.setItem('peoplecom-motion','Reduced');const {result}=renderHook(()=>useMotionPreference());await waitFor(()=>expect(result.current.ready).toBe(true));expect(result.current.reduced).toBe(true);});
 it('synchronizes a footer toggle with every mounted motion control',async()=>{const {result}=renderHook(()=>({first:useMotionPreference(),second:useMotionPreference()}));await waitFor(()=>expect(result.current.first.ready).toBe(true));act(()=>result.current.second.toggle());expect(result.current.first.reduced).toBe(true);expect(result.current.second.reduced).toBe(true);expect(localStorage.getItem('peoplecom-motion')).toBe('Reduced');act(()=>result.current.first.toggle());expect(result.current.second.reduced).toBe(false);expect(localStorage.getItem('peoplecom-motion')).toBe('Full');});
});