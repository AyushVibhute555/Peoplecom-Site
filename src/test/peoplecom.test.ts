import {describe,it,expect} from 'vitest';
import {visible} from '@/content/home';
import {FRAMES,frameUrl,timecode} from '@/config/frames';
describe('Peoplecom rules',()=>{
 it('never publishes invented placeholder facts',()=>{expect(visible({placeholder:true},true)).toBe(false);expect(visible({placeholder:false},true)).toBe(true);expect(visible({placeholder:true},false)).toBe(true);});
 it('uses 24fps timecodes up to two minutes',()=>{expect(timecode(120)).toBe('00:02:00:00');expect(timecode(7.5)).toBe('00:00:07:12');});
 it('uses one-based desktop and mobile frame sets',()=>{expect(FRAMES.desktop.count).toBe(180);expect(FRAMES.mobile.count).toBe(90);expect(frameUrl(FRAMES.desktop,1)).toBe('/frames/v1/desktop/f_0001.webp');});
});
