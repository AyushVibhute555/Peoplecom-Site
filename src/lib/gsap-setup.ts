import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import {useGSAP} from '@gsap/react';
export function setupGSAP(){gsap.registerPlugin(ScrollTrigger,SplitText,useGSAP);ScrollTrigger.config({ignoreMobileResize:true});return {gsap,ScrollTrigger,SplitText};}
