import {createFileRoute} from '@tanstack/react-router';
import {ComingSoon} from '@/components/home/ComingSoon';
import {PAGES,pageHead} from '@/content/pages';
export const Route=createFileRoute('/work')({head:()=>pageHead(PAGES.work.title,PAGES.work.description,'/work'),component:Page});
function Page(){return <ComingSoon title={PAGES.work.title} line={PAGES.work.line}/>;}
