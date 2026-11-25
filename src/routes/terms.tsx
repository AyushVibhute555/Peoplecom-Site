import {createFileRoute} from '@tanstack/react-router';
import {ComingSoon} from '@/components/home/ComingSoon';
import {PAGES,pageHead} from '@/content/pages';
export const Route=createFileRoute('/terms')({head:()=>pageHead(PAGES.terms.title,PAGES.terms.description,'/terms'),component:TermsPage});
function TermsPage(){return <ComingSoon title={PAGES.terms.title} line={PAGES.terms.line}/>;}