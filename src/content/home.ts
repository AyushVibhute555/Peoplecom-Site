export interface ClientLogo {name:string;media:string;permitted:boolean;placeholder?:boolean;}
export interface Testimonial {id:string;quote:string;name:string;role:string;brand:string;placeholder?:boolean;}
export interface OpenRole {title:string;url:string;placeholder?:boolean;}
export interface SocialLink {name:string;url:string;placeholder?:boolean;}
export const HOME = {
 brand: 'peoplecom', agency: 'Brand & Creative Agency', city: 'Bengaluru',
 hero: ['Brands are built by people.', 'So we start with them.', 'Frame by frame, we turn ideas into brands people remember.'],
 rolling: 'Rolling camera…', play: 'Play film', stop: 'Stop film', skip: 'Skip film', scroll: 'Scroll to direct the film', workCta: 'See our work', contactCta: 'Start a conversation',
 skipContent:'Skip to content',menu:'Open menu',
 manifesto: { title: 'People first.\nBrands follow.', copy: 'Before the mark, the message or the big idea, there are people. What they need. What they feel. What makes them lean in.', detail: 'We’re Peoplecom. A brand and creative agency in Bengaluru, building connections between businesses and the people who make them matter.', aside: 'A little curiosity. A lot of listening.' },
 services: [
 {title:'Brand Strategy', copy:'Find the one idea your brand can own.', media:'service-01'},
 {title:'Identity & Design Systems', copy:'From logo to the last signage detail, consistent everywhere.', media:'service-02'},
 {title:'Creative Campaigns', copy:'Idea-led work across digital and offline.', media:'service-03'},
 {title:'Content & Social', copy:'Stories that sound like you, only sharper.', media:'service-04'},
 {title:'Websites & Motion', copy:'Digital experiences and animation that feel as good as they look.', media:'service-05'},
 {title:'Employer Branding & Internal Communication', copy:'Where we began: helping companies talk to their own people.', media:'service-06'}],
 serviceOpen: 'Open',
 sectorsHeading:'Where we do our best work',
 sectors: [
 {title:'Real Estate',copy:'Homes and communities that sell a way of living, not just square feet.',media:'sector-realestate',key:'realestate'},
 {title:'Coliving & Student Living',copy:'Brands for the way a new generation lives, studies and belongs.',media:'sector-coliving',key:'coliving'},
 {title:'Healthcare',copy:'Clear, human communication where trust matters most.',media:'sector-healthcare',key:'healthcare'},
 {title:'Retail & Lifestyle',copy:'Stores, labels and experiences people talk about.',media:'sector-retail',key:'retail'}],
 workEmpty:'Nothing here yet. Show all.',workAll:'See all work →',workView:'View',workIllustrative:'Illustrative cover',interlude:'Frame by frame',
 way: [
 {title:'Listen',copy:'We start with your people: customers, residents, patients, teams.',media:'way-01',theme:'paper'},
 {title:'Define',copy:'We boil it down to one idea worth owning.',media:'way-02',theme:'teal'},
 {title:'Create',copy:'Design, words, motion and code, built to work together.',media:'way-03',theme:'ink'},
 {title:'Amplify',copy:'We launch across digital and offline, then see what moved.',media:'way-04',theme:'yellow'}],
 journal: [
 {title:'How coliving brands earn the trust of students and parents',category:'Coliving',media:'journal-01',slug:'coliving-brands-trust'},
 {title:'What a healthcare brand owes its patients',category:'Healthcare',media:'journal-02',slug:'healthcare-brand-patients'},
 {title:'Brand identity vs design system: what’s the difference?',category:'Brand thinking',media:'journal-03',slug:'brand-identity-vs-design-system'}],
 journalTitle:'Thinking out loud',journalLink:'Read the journal →',dragLabel:'Drag',
 proof: {since:'Since',year:2018,sectors:'sectors',brands:'brands',campaigns:'campaigns',unknown:'[XX]+',fallbackNames:['Real estate','Coliving & student living','Healthcare','Retail','Lifestyle']},
 clients: [] as ClientLogo[],
 testimonials: [{id:'quote-placeholder',quote:'[Real client quote, 25 words max]',name:'[Name]',role:'[Role]',brand:'[Brand]',placeholder:true}] as Testimonial[],
 testimonialLabels: {previous:'Previous testimonial',next:'Next testimonial',select:'Show testimonial',quotes:'Client testimonials'},
 team: {title:'Small team. Big opinions.',copy:'We’re a close team of thinkers, designers, writers and makers in Bengaluru. We argue about fonts, then make something great.',careers:'Join the team →',previous:'Previous studio detail',next:'Next studio detail'},
 openRoles:[] as OpenRole[],
 contact: {title:'Got a brand that deserves better? Let’s talk.',email:{value:'',label:'[email]',placeholder:true},phone:{value:'',label:'[phone]',placeholder:true},replyHours:{value:'',label:'We reply within [X] hours.',placeholder:true},replyFallback:'We reply as soon as we can.',cta:'Let’s talk',roll:'UP Your Game'},
 form:{name:'Name',email:'Email',message:'One line about the project',honeypot:'Leave this empty',send:'Send message',sending:'Sending…',retry:'Try again',failure:'That didn’t go through. Please try again.',mail:'Email us instead',mailMissing:'Email contact will appear here once confirmed.',newsletter:'Newsletter',subscribe:'Subscribe',subscribed:'You’re on the list.',reference:'Reference'},
 socials: [{name:'LinkedIn',url:'',placeholder:true},{name:'Instagram',url:'',placeholder:true},{name:'Facebook',url:'',placeholder:true}] as SocialLink[],
 footer: {legal:'Peoplecom Technologies Pvt Ltd',location:'Halasuru, Bengaluru',address:{value:'',label:'[Street address]',placeholder:true},signoff:'Made with coffee and cookies in Bengaluru.',copyright:'© 2026 Peoplecom Technologies Pvt Ltd',top:'Back to top',privacy:'Privacy',terms:'Terms'},
 labels: {manifesto:'Manifesto',services:'What we do',sectors:'The worlds we work in',work:'Selected work',way:'The Peoplecom Way',proof:'Our roots',testimonials:'In their words',journal:'Notes from the studio',team:'Behind the work',contact:'Let’s make something matter',placeholder:'Placeholder',motion:'Motion',full:'Full',reduced:'Reduced'},
 nav: [{title:'Work',id:'work'},{title:'Approach',id:'way'},{title:'About',id:'manifesto'}],
 scenes: [{id:'manifesto',name:'Manifesto',number:'01'},{id:'services',name:'Services',number:'02'},{id:'sectors',name:'Sectors',number:'03'},{id:'work',name:'Work',number:'04'},{id:'way',name:'The Peoplecom Way',number:'05'},{id:'contact',name:'Contact',number:'06'}],
 ticker:['People first','Ideas with purpose','Frame by frame'],
};
export function visible(item: {placeholder?: boolean}, production = import.meta.env.PROD) { return !item.placeholder || !production; }
