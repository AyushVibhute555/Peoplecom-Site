import {describe,it,expect} from 'vitest';
import {HOME} from '@/content/home';
import {proofCells,permittedLogos,publishedQuotes,canAutoplay,carouselIndex,TESTIMONIAL_INTERVAL} from '@/config/proof';
const logos=Array.from({length:4},(_,i)=>({name:`Client ${i}`,media:`logo-${i}`,permitted:true}));
describe('Phase 4 rules',()=>{
 it('counts four sectors from the list, and preserves 2018 as a static year',()=>{const cells=proofCells(true);expect(cells).toHaveLength(2);expect(cells.find(c=>c.id==='since')).toMatchObject({value:2018,static:true});expect(cells.find(c=>c.id==='sectors')?.value).toBe(4);expect(HOME.sectors.length).toBe(4);});
 it('hides placeholder proof figures and quotes in production',()=>{expect(proofCells(false)).toHaveLength(4);expect(proofCells(true).some(c=>c.placeholder)).toBe(false);expect(publishedQuotes(HOME.testimonials,true)).toHaveLength(0);});
 it('requires at least four permitted logos',()=>{expect(permittedLogos(logos.slice(0,3),true)).toHaveLength(0);expect(permittedLogos(logos,true)).toHaveLength(4);expect(permittedLogos([...logos.slice(0,3),{name:'Unapproved',media:'x',permitted:false}],true)).toHaveLength(0);});
 it('uses an 8-second carousel and pauses for reduced motion, focus/hover or hidden tabs',()=>{expect(TESTIMONIAL_INTERVAL).toBe(8000);expect(canAutoplay(false,false,true,2)).toBe(true);expect(canAutoplay(true,false,true,2)).toBe(false);expect(canAutoplay(false,true,true,2)).toBe(false);expect(canAutoplay(false,false,false,2)).toBe(false);expect(canAutoplay(false,false,true,1)).toBe(false);});
 it('wraps previous and next controls',()=>{expect(carouselIndex(0,-1,3)).toBe(2);expect(carouselIndex(2,1,3)).toBe(0);});
});
