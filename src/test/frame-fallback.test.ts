import {describe,it,expect,vi,afterEach} from 'vitest';
import {loadFrames} from '@/lib/frame-sequence';
afterEach(()=>vi.unstubAllGlobals());
describe('Film failure fallback',()=>{
 it('never requests absent frame sets while availability is off',async()=>{const request=vi.fn();vi.stubGlobal('fetch',request);const result=await loadFrames(false,()=>{},new AbortController().signal);expect(result.fallback).toBe(true);expect(request).not.toHaveBeenCalled();});
 it('uses the storyboard when an available frame returns 404',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('',{status:404})));const result=await loadFrames(false,()=>{},new AbortController().signal,true);expect(result.fallback).toBe(true);expect(result.images.size).toBe(0);});
 it('uses the storyboard after a network failure',async()=>{vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('offline')));expect((await loadFrames(true,()=>{},new AbortController().signal,true)).fallback).toBe(true);});
});