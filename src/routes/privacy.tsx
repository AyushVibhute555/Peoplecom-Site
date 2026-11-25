import {createFileRoute} from '@tanstack/react-router';
import {ComingSoon} from '@/components/home/ComingSoon';
import {PAGES,pageHead} from '@/content/pages';
export const Route=createFileRoute('/privacy')({head:()=>pageHead(PAGES.privacy.title,PAGES.privacy.description,'/privacy'),component:PrivacyPage});
function PrivacyPage(){return <ComingSoon title={PAGES.privacy.title} line={PAGES.privacy.line}/>;}