import {useState} from 'react';
import {Link} from '@tanstack/react-router';
import {motion,useSpring} from 'motion/react';
import {ArrowLeft,ArrowRight,ArrowUpRight} from 'lucide-react';
import {HOME,visible} from '@/content/home';
import {Button} from '@/components/ui/button';
import {useCoarsePointer,useLite} from '@/hooks/useMotionPreference';
import {useMeasuredStrip} from '@/hooks/useMeasuredStrip';
import {MaskLines,MediaFrame,SceneHeading,WipeButton,MagneticButton} from './Primitives';
import {ContactForm} from './LeadForms';
import {JournalCards} from './JournalCards';
function DragCursor({active,x,y}:{active:boolean;x:ReturnType<typeof useSpring>;y:ReturnType<typeof useSpring>}){return active?<motion.span className="drag-cursor mono" style={{x,y}} aria-hidden="true">{HOME.dragLabel}</motion.span>:null;}
export function Journal({reduced}:{reduced:boolean}){
 return <section id="journal" data-theme="paper" className="section journal-film" data-reduced={reduced}><div className="container"><SceneHeading label={HOME.labels.journal}/><div className="section-title-row"><h2>{HOME.journalTitle}</h2><WipeButton asChild><Link to="/journal">{HOME.journalLink}</Link></WipeButton></div>
 <JournalCards/></div></section>;
}
export function Team({reduced}:{reduced:boolean}){
 const {viewport,track,distance,target,x,move}=useMeasuredStrip(reduced);const coarse=useCoarsePointer();const lite=useLite();const [hover,setHover]=useState(false);const cursorX=useSpring(0);const cursorY=useSpring(0);
 // Generated studio details are stand-ins, not team portraits. Replace with approved real team photos.
 return <section data-theme="ink" className="section team-film" data-reduced={reduced}><div className="container"><SceneHeading label={HOME.labels.team}/><div className="team-intro"><h2>{HOME.team.title}</h2><div><p>{HOME.team.copy}</p><WipeButton asChild><Link to="/careers">{HOME.team.careers}</Link></WipeButton>{HOME.openRoles.filter(r=>visible(r)).map(role=><p key={role.title}><a href={role.url}>{role.title}</a></p>)}</div></div><div className="team-strip-controls"><Button variant="ghost" aria-label={HOME.team.previous} title={HOME.team.previous} onClick={()=>move(-1)}><ArrowLeft/></Button><Button variant="ghost" aria-label={HOME.team.next} title={HOME.team.next} onClick={()=>move(1)}><ArrowRight/></Button></div>
 <div ref={viewport} className="team-strip" aria-label={HOME.labels.team} onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}}} onPointerEnter={()=>setHover(true)} onPointerLeave={()=>setHover(false)} onPointerMove={e=>{cursorX.set(e.clientX+16);cursorY.set(e.clientY+16);}}>
 <motion.div ref={track} className="team-strip-track" drag="x" dragConstraints={{left:-distance,right:0}} dragElastic={reduced?0:.08} dragMomentum={!reduced} style={{x}} onDragStart={()=>target.stop()}>{[1,2,3,4,5,6].map((n,index)=><div key={n} tabIndex={0} aria-label={`Studio detail ${n}`} className="team-strip-item" onFocus={()=>{if(!viewport.current)return;viewport.current.scrollLeft=0;const first=track.current?.firstElementChild?.getBoundingClientRect().width??0;target.set(-Math.min(distance,index*(first+24)));}}><MediaFrame id={`team-0${n}`}/></div>)}</motion.div></div></div><DragCursor active={hover&&!coarse&&!lite&&!reduced} x={cursorX} y={cursorY}/></section>;
}
export function Contact({reduced,standalone=false}:{reduced:boolean;standalone?:boolean}){
 const [open,setOpen]=useState(standalone);return <section id="contact" data-theme="signal" className="section contact contact-film"><div className="container"><SceneHeading number="06" label={HOME.labels.contact}/><MaskLines>{standalone?<h1>{HOME.contact.title}</h1>:<h2>{HOME.contact.title}</h2>}</MaskLines><div className="contact-details">{HOME.contact.email.value?<a href={`mailto:${encodeURIComponent(HOME.contact.email.value)}`}>{HOME.contact.email.value}</a>:!import.meta.env.PROD&&<div><span>{HOME.contact.email.label}</span><span className="placeholder-tag">{HOME.labels.placeholder}</span></div>}{HOME.contact.phone.value?<a href={`tel:${HOME.contact.phone.value.replace(/[^+\d]/g,'')}`}>{HOME.contact.phone.value}</a>:!import.meta.env.PROD&&<div><span>{HOME.contact.phone.label}</span><span className="placeholder-tag">{HOME.labels.placeholder}</span></div>}<div>{HOME.contact.replyHours.value?`We reply within ${HOME.contact.replyHours.value} hours.`:import.meta.env.PROD?HOME.contact.replyFallback:<><span>{HOME.contact.replyHours.label}</span><span className="placeholder-tag">{HOME.labels.placeholder}</span></>}</div></div>
 <MagneticButton reduced={reduced}><Button className="ink-button talk-button" aria-expanded={open} aria-controls="contact-mini-form" onClick={()=>setOpen(value=>!value)}><span className="talk-roll"><span>{HOME.contact.cta}</span><span aria-hidden="true">{HOME.contact.roll}</span></span><ArrowUpRight aria-hidden="true"/></Button></MagneticButton><div id="contact-mini-form" hidden={!open}><ContactForm/></div></div></section>;
}