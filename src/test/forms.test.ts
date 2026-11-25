import {describe,it,expect} from 'vitest';
import {contactSchema,newsletterSchema,contactReference} from '@/config/forms';
const valid={name:'Ayush',email:'hello@example.com',message:'A brand identity project.',website:''};
describe('Peoplecom lead validation',()=>{
 it('accepts names of 120 characters and rejects 121',()=>{expect(contactSchema.safeParse({...valid,name:'a'.repeat(120)}).success).toBe(true);expect(contactSchema.safeParse({...valid,name:'a'.repeat(121)}).success).toBe(false);});
 it('accepts a project message of 280 characters and rejects 281',()=>{expect(contactSchema.safeParse({...valid,message:'a'.repeat(280)}).success).toBe(true);expect(contactSchema.safeParse({...valid,message:'a'.repeat(281)}).success).toBe(false);});
 it('rejects blank required fields',()=>{for(const key of ['name','email','message'])expect(contactSchema.safeParse({...valid,[key]:' '}).success).toBe(false);});
 it('rejects invalid emails in both forms',()=>{expect(contactSchema.safeParse({...valid,email:'not-email'}).success).toBe(false);expect(newsletterSchema.safeParse({email:'not-email',website:''}).success).toBe(false);});
 it('rejects a filled honeypot in both forms',()=>{expect(contactSchema.safeParse({...valid,website:'spam'}).success).toBe(false);expect(newsletterSchema.safeParse({email:valid.email,website:'spam'}).success).toBe(false);});
 it('limits email to 254 characters',()=>{const email=`${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(61)}`;expect(email.length).toBe(254);expect(newsletterSchema.safeParse({email,website:''}).success).toBe(true);expect(newsletterSchema.safeParse({email:`a${email}`,website:''}).success).toBe(false);});
 it('uses the first five record-id characters in the reference',()=>{expect(contactReference('4f9k2-abcdef')).toBe('PC-4F9K2');});
});