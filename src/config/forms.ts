import {z} from 'zod';
export const emailSchema=z.string().trim().email('Enter a valid email address.').min(3).max(254,'Use 254 characters or fewer.').transform(value=>value.toLowerCase());
const honeypot=z.string().max(0,'Unable to send this entry.');
export const contactSchema=z.object({name:z.string().trim().min(1,'Enter your name.').max(120,'Use 120 characters or fewer.'),email:emailSchema,message:z.string().trim().min(1,'Tell us one line about the project.').max(280,'Use 280 characters or fewer.'),website:honeypot});
export const newsletterSchema=z.object({email:emailSchema,website:honeypot});
export type ContactInput=z.input<typeof contactSchema>;
export type NewsletterInput=z.input<typeof newsletterSchema>;
export function contactReference(id:string){return `PC-${id.slice(0,5).toUpperCase()}`;}
export function contactConfirmation(name:string,hours:string){const first=name.trim().split(/\s+/)[0]??name;return hours?`Got it, ${first}. We’ll reply within ${hours} hours.`:`Got it, ${first}. We’ll reply as soon as we can.`;}