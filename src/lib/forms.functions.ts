import {createServerFn} from '@tanstack/react-start';
import {contactSchema,newsletterSchema} from '@/config/forms';
export const sendContact=createServerFn({method:'POST'}).inputValidator((input:unknown)=>contactSchema.parse(input)).handler(async({data})=>{
 try{
 const {claimAttempt}=await import('./forms.server');if(!await claimAttempt('contact'))return {ok:false as const,reason:'Too many attempts. Please try again in 15 minutes.'};
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');const id=crypto.randomUUID();
 const {error}=await supabaseAdmin.from('contact_messages').insert({id,name:data.name,email:data.email,message:data.message,source:'home'});
 if(error)return {ok:false as const,reason:'That didn’t go through. Please try again.'};return {ok:true as const,id};
 }catch{return {ok:false as const,reason:'That didn’t go through. Please try again.'};}
});
export const subscribeNewsletter=createServerFn({method:'POST'}).inputValidator((input:unknown)=>newsletterSchema.parse(input)).handler(async({data})=>{
 try{
 const {claimAttempt}=await import('./forms.server');if(!await claimAttempt('newsletter'))return {ok:false as const,reason:'Too many attempts. Please try again in 15 minutes.'};
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {error}=await supabaseAdmin.from('newsletter_subscribers').upsert({email:data.email},{onConflict:'email',ignoreDuplicates:true});
 return error?{ok:false as const,reason:'That didn’t go through. Please try again.'}:{ok:true as const};
 }catch{return {ok:false as const,reason:'That didn’t go through. Please try again.'};}
});