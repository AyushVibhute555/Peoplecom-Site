import {lazy,Suspense} from 'react';
const Services=lazy(()=>import('./Services').then(m=>({default:m.Services})));
const Sectors=lazy(()=>import('./PhaseThree').then(m=>({default:m.Sectors})));
const SelectedWork=lazy(()=>import('./PhaseThree').then(m=>({default:m.SelectedWork})));
const Marquee=lazy(()=>import('./PhaseThree').then(m=>({default:m.Marquee})));
const Way=lazy(()=>import('./PhaseFour').then(m=>({default:m.Way})));
const Proof=lazy(()=>import('./PhaseFour').then(m=>({default:m.Proof})));
const Testimonials=lazy(()=>import('./PhaseFour').then(m=>({default:m.Testimonials})));
const Journal=lazy(()=>import('./PhaseFive').then(m=>({default:m.Journal})));
const Team=lazy(()=>import('./PhaseFive').then(m=>({default:m.Team})));
const Contact=lazy(()=>import('./PhaseFive').then(m=>({default:m.Contact})));
// SSR resolves the modules and emits their copy; no client-only gate hides content from crawlers.
export function BelowFold({reduced}:{reduced:boolean}){return <Suspense fallback={null}><Services/><Sectors reduced={reduced}/><SelectedWork reduced={reduced}/><Marquee reduced={reduced}/><Way reduced={reduced}/><Proof reduced={reduced}/><Testimonials reduced={reduced}/><Journal reduced={reduced}/><Team reduced={reduced}/><Contact reduced={reduced}/></Suspense>;}