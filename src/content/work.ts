export const WORK_FILTERS=['All','Brand Identity','Web Design','Web Development'] as const;
export type WorkFilter=typeof WORK_FILTERS[number];
export interface Project {id:string;title:string;sector:string;sectorKey:string;service:string;tags:readonly string[];result:string;cover:string;placeholder:boolean;illustrative?:boolean;video?:string;}
export const WORK:Project[]=[
 {id:'01',title:'Curated Living Solutions',sector:'Coliving & student housing',sectorKey:'coliving',service:'Brand strategy, design systems, content and campaigns',tags:['Brand Identity'],result:'Brand strategy, design systems, content and campaigns across digital and offline for a platform backed by DivyaSree Group.',cover:'work-02',placeholder:false,illustrative:true},
 {id:'02',title:'[Project]',sector:'[Sector]',sectorKey:'realestate',service:'[Service]',tags:['Web Design'],result:'[One-line result]',cover:'work-01',placeholder:true},
 {id:'03',title:'[Project]',sector:'[Sector]',sectorKey:'healthcare',service:'[Service]',tags:['Web Development'],result:'[One-line result]',cover:'work-03',placeholder:true},
 {id:'04',title:'[Project]',sector:'[Sector]',sectorKey:'retail',service:'[Service]',tags:['Brand Identity','Web Design','Web Development'],result:'[One-line result]',cover:'work-04',placeholder:true},
];
export function filterWork(filter:WorkFilter,production=import.meta.env.PROD){return WORK.filter(p=>(!production||!p.placeholder)&&(filter==='All'||p.tags.includes(filter)));}
