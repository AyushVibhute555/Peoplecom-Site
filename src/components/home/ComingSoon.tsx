import {Link} from '@tanstack/react-router';
import {Button} from '@/components/ui/button';
import {PAGES} from '@/content/pages';
import {useMotionPreference} from '@/hooks/useMotionPreference';
import {Navigation,Footer} from './SiteChrome';
export function ComingSoon({title,line}:{title:string;line:string}){const {reduced,toggle}=useMotionPreference();return <div className="stub-page"><Navigation/><main id="main-content" tabIndex={-1} data-theme="paper" className="coming-soon"><div className="container"><h1>{title}</h1><p>{line}</p><Button asChild><Link to="/">{PAGES.back}</Link></Button></div></main><Footer reduced={reduced} toggle={toggle}/></div>;}