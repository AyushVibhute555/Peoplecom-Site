import {HOME,visible,type ClientLogo,type Testimonial} from '@/content/home';
export const TESTIMONIAL_INTERVAL=8000;
export const TESTIMONIAL_FADE=1.2;
export function carouselIndex(current:number,direction:number,count:number){return count>0?((current+direction)%count+count)%count:0;}
export function canAutoplay(reduced:boolean,paused:boolean,visibleTab:boolean,count:number){return !reduced&&!paused&&visibleTab&&count>1;}
export function permittedLogos(clients:ClientLogo[],production=import.meta.env.PROD){const permitted=clients.filter(c=>c.permitted&&visible(c,production));return permitted.length>=4?permitted:[];}
export function publishedQuotes(quotes:Testimonial[],production=import.meta.env.PROD){return quotes.filter(q=>visible(q,production));}
export function proofCells(production=import.meta.env.PROD){return [
  {id:'since',value:HOME.proof.year,label:HOME.proof.since,static:true,placeholder:false},
  {id:'sectors',value:HOME.sectors.length,label:HOME.proof.sectors,static:false,placeholder:false},
  {id:'brands',value:HOME.proof.unknown,label:HOME.proof.brands,static:true,placeholder:true},
  {id:'campaigns',value:HOME.proof.unknown,label:HOME.proof.campaigns,static:true,placeholder:true},
].filter(c=>visible(c,production));}