import {getRequestHeader} from '@tanstack/react-start/server';
import {supabaseAdmin} from '@/integrations/supabase/client.server';
export async function claimAttempt(kind:'contact'|'newsletter'){
 // Only the hosting edge's trusted IP header is used; never accept a client-supplied forwarded IP.
 const ip=getRequestHeader('cf-connecting-ip')??'unavailable';
 const secret=process.env['SUPABASE_SERVICE_ROLE_KEY'];if(!secret)throw new Error('Submission service unavailable');
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const digest=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`${kind}:${ip}`));
 const hash=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
 const {data,error}=await supabaseAdmin.rpc('claim_form_attempt',{p_key:hash});
 if(error)throw new Error('Submission service unavailable');return data===true;
}