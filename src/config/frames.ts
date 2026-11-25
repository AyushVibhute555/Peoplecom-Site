export const FRAMES = {
 version:'v1', available:false,
 desktop:{baseUrl:'/frames/v1/desktop',count:180,pad:4,ext:'webp',width:1600,height:900},
 mobile:{baseUrl:'/frames/v1/mobile',count:90,pad:4,ext:'webp',width:720,height:1280},
 poster:'/frames/v1/poster.webp',focal:{x:0.5,y:0.5},idle:{from:1,to:10,fps:6},
};
export function timecode(seconds:number) {
 const f=Math.floor(Math.max(0,seconds)*24); return [Math.floor(f/86400),Math.floor(f/1440)%60,Math.floor(f/24)%60,f%24].map(n=>String(n).padStart(2,'0')).join(':');
}
export function frameUrl(set:typeof FRAMES.desktop,index:number) {return `${set.baseUrl}/f_${String(index).padStart(set.pad,'0')}.${set.ext}`;}
