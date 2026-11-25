import {createFileRoute} from '@tanstack/react-router';
import {ComingSoon} from '@/components/home/ComingSoon';
import {PAGES,pageHead} from '@/content/pages';
export const Route=createFileRoute('/journal/')({head:()=>pageHead(PAGES.journal.title,PAGES.journal.description,'/journal'),component:JournalPage});
function JournalPage(){return <ComingSoon title={PAGES.journal.title} line={PAGES.journal.line}/>;}