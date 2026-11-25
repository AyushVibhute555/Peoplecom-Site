import {createFileRoute} from '@tanstack/react-router';
import {ComingSoon} from '@/components/home/ComingSoon';
import {PAGES,pageHead} from '@/content/pages';
export const Route=createFileRoute('/careers')({head:()=>pageHead(PAGES.careers.title,PAGES.careers.description,'/careers'),component:Page});
function Page(){return <ComingSoon title={PAGES.careers.title} line={PAGES.careers.line}/>;}
