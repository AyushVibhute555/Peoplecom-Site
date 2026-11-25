export const PAGES = {
 contact:{title:'Let’s start a conversation.',description:'Connect with Peoplecom, a brand and creative agency in Bengaluru.'},
 work:{title:'Selected work',description:'People-first brand and digital work from Peoplecom, Bengaluru.',line:'Our work is getting its next scene.'},
 journal:{title:'Journal',description:'Peoplecom thoughts on coliving, healthcare and brand design.',line:'More thinking out loud, coming soon.'},
 careers:{title:'Careers',description:'Careers at Peoplecom, Bengaluru.',line:'Our next team scene is coming soon.'},
 privacy:{title:'Privacy',description:'Peoplecom privacy information.',line:'Our privacy notice is being prepared.'},
 terms:{title:'Terms',description:'Peoplecom website terms.',line:'Our terms are being prepared.'},
 article:{line:'This story is being prepared.'},
 notFound:'Cut. This scene isn’t in the film.',back:'Back to home',
};
export function pageHead(title:string,description:string,path?:string){return {links:path?[{rel:'canonical',href:path}]:[],meta:[{title:`Peoplecom — ${title}`},{name:'description',content:description},{property:'og:title',content:`Peoplecom — ${title}`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'},...(path?[{property:'og:url',content:path}]:[])]};}
