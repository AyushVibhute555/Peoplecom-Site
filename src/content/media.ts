import asset0 from "../assets/peoplecom/journal-01.webp.asset.json";
import posterShare from '../assets/peoplecom/poster-share.webp.asset.json';
import asset1 from "../assets/peoplecom/journal-02.webp.asset.json";
import asset2 from "../assets/peoplecom/journal-03.webp.asset.json";
import asset3 from "../assets/peoplecom/manifesto-clinic.webp.asset.json";
import asset4 from "../assets/peoplecom/manifesto-home.webp.asset.json";
import asset5 from "../assets/peoplecom/manifesto-people.webp.asset.json";
import asset6 from "../assets/peoplecom/manifesto-store.webp.asset.json";
import asset7 from "../assets/peoplecom/poster-hero.webp.asset.json";
import asset8 from "../assets/peoplecom/sector-coliving.webp.asset.json";
import asset9 from "../assets/peoplecom/sector-healthcare.webp.asset.json";
import asset10 from "../assets/peoplecom/sector-realestate.webp.asset.json";
import asset11 from "../assets/peoplecom/sector-retail.webp.asset.json";
import asset12 from "../assets/peoplecom/service-01.webp.asset.json";
import asset13 from "../assets/peoplecom/service-02.webp.asset.json";
import asset14 from "../assets/peoplecom/service-04.webp.asset.json";
import asset15 from "../assets/peoplecom/service-05.webp.asset.json";
import asset16 from "../assets/peoplecom/service-06.webp.asset.json";
import asset17 from "../assets/peoplecom/team-01.webp.asset.json";
import asset18 from "../assets/peoplecom/team-02.webp.asset.json";
import asset19 from "../assets/peoplecom/team-03.webp.asset.json";
import asset20 from "../assets/peoplecom/team-04.webp.asset.json";
import asset21 from "../assets/peoplecom/team-05.webp.asset.json";
import asset22 from "../assets/peoplecom/team-06.webp.asset.json";
import asset23 from "../assets/peoplecom/way-01.webp.asset.json";
import asset24 from "../assets/peoplecom/way-02.webp.asset.json";
import asset25 from "../assets/peoplecom/way-03.webp.asset.json";
import asset26 from "../assets/peoplecom/way-04.webp.asset.json";
import asset27 from "../assets/peoplecom/work-01.webp.asset.json";
import asset28 from "../assets/peoplecom/work-02.webp.asset.json";
import asset29 from "../assets/peoplecom/work-03.webp.asset.json";
import asset30 from "../assets/peoplecom/work-04.webp.asset.json";
export interface MediaRecord { id: string; src: string; alt: string; ratio: string; focal: {x: number; y: number}; placeholder?: boolean; video?: string; }
export const MEDIA: Record<string, MediaRecord> = {
 "journal-01": { id:"journal-01",src:asset0.url,alt:"Generated illustrative journal 01 photograph",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "journal-02": { id:"journal-02",src:asset1.url,alt:"Generated illustrative journal 02 photograph",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "journal-03": { id:"journal-03",src:asset2.url,alt:"Generated illustrative journal 03 photograph",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "manifesto-clinic": { id:"manifesto-clinic",src:asset3.url,alt:"Quiet clinic reception",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "manifesto-home": { id:"manifesto-home",src:asset4.url,alt:"Sunlit living room",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "manifesto-people": { id:"manifesto-people",src:asset5.url,alt:"Hands arranging brand boards on a studio table",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "manifesto-store": { id:"manifesto-store",src:asset6.url,alt:"Boutique shopfront at dusk",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "poster-hero": { id:"poster-hero",src:asset7.url,alt:"Pencil wordmark studies on a sunlit studio table",ratio:"16/9",focal:{x:0.5,y:0.5} },
 "sector-coliving": { id:"sector-coliving",src:asset8.url,alt:"Generated illustrative sector coliving photograph",ratio:"3/4",focal:{x:0.5,y:0.5} },
 "sector-healthcare": { id:"sector-healthcare",src:asset9.url,alt:"Generated illustrative sector healthcare photograph",ratio:"3/4",focal:{x:0.5,y:0.5} },
 "sector-realestate": { id:"sector-realestate",src:asset10.url,alt:"Generated illustrative sector realestate photograph",ratio:"3/4",focal:{x:0.5,y:0.5} },
 "sector-retail": { id:"sector-retail",src:asset11.url,alt:"Generated illustrative sector retail photograph",ratio:"3/4",focal:{x:0.5,y:0.5} },
 "service-01": { id:"service-01",src:asset12.url,alt:"Generated illustrative service 01 photograph",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "service-02": { id:"service-02",src:asset13.url,alt:"Generated illustrative service 02 photograph",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "service-04": { id:"service-04",src:asset14.url,alt:"Generated illustrative service 04 photograph",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "service-05": { id:"service-05",src:asset15.url,alt:"Generated illustrative service 05 photograph",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "service-06": { id:"service-06",src:asset16.url,alt:"Generated illustrative service 06 photograph",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "team-01": { id:"team-01",src:asset17.url,alt:"Generated illustrative team 01 photograph",ratio:"3/2",focal:{x:0.5,y:0.5} },
 "team-02": { id:"team-02",src:asset18.url,alt:"Generated illustrative team 02 photograph",ratio:"3/2",focal:{x:0.5,y:0.5} },
 "team-03": { id:"team-03",src:asset19.url,alt:"Generated illustrative team 03 photograph",ratio:"3/2",focal:{x:0.5,y:0.5} },
 "team-04": { id:"team-04",src:asset20.url,alt:"Generated illustrative team 04 photograph",ratio:"3/2",focal:{x:0.5,y:0.5} },
 "team-05": { id:"team-05",src:asset21.url,alt:"Generated illustrative team 05 photograph",ratio:"3/2",focal:{x:0.5,y:0.5} },
 "team-06": { id:"team-06",src:asset22.url,alt:"Generated illustrative team 06 photograph",ratio:"3/2",focal:{x:0.5,y:0.5} },
 "way-01": { id:"way-01",src:asset23.url,alt:"Generated illustrative way 01 photograph",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "way-02": { id:"way-02",src:asset24.url,alt:"Generated illustrative way 02 photograph",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "way-03": { id:"way-03",src:asset25.url,alt:"Generated illustrative way 03 photograph",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "way-04": { id:"way-04",src:asset26.url,alt:"Generated illustrative way 04 photograph",ratio:"4/5",focal:{x:0.5,y:0.5} },
 "work-01": { id:"work-01",src:asset27.url,alt:"Generated illustrative work 01 photograph",ratio:"16/9",focal:{x:0.5,y:0.5} },
 "work-02": { id:"work-02",src:asset28.url,alt:"Generated illustrative work 02 photograph",ratio:"16/9",focal:{x:0.5,y:0.5} },
 "work-03": { id:"work-03",src:asset29.url,alt:"Generated illustrative work 03 photograph",ratio:"16/9",focal:{x:0.5,y:0.5} },
 "work-04": { id:"work-04",src:asset30.url,alt:"Generated illustrative work 04 photograph",ratio:"16/9",focal:{x:0.5,y:0.5} },
 "service-03": {id:"service-03",src:"",alt:"Outdoor hoarding and brand collateral",ratio:"4/5",focal:{x:0.5,y:0.5},placeholder:true},
};
export const FAVICON = "/favicon.svg";
export const POSTER_SHARE=posterShare.url;