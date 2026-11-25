import {createFileRoute} from '@tanstack/react-router';
import {PAGES,pageHead} from '@/content/pages';
import {Contact} from '@/components/home/PhaseFive';
import {Navigation,Footer} from '@/components/home/SiteChrome';
import {useMotionPreference} from '@/hooks/useMotionPreference';
export const Route=createFileRoute('/contact')({head:()=>pageHead('Contact',PAGES.contact.description,'/contact'),component:ContactPage});
function ContactPage(){const {reduced,toggle}=useMotionPreference();return <div className="stub-page"><Navigation/><main id="main-content" tabIndex={-1}><Contact reduced={reduced} standalone/></main><Footer reduced={reduced} toggle={toggle}/></div>;}
