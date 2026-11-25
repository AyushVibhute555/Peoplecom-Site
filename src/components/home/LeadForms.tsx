import {useId,useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useServerFn} from '@tanstack/react-start';
import {Button} from '@/components/ui/button';
import {HOME} from '@/content/home';
import {contactSchema,newsletterSchema,contactConfirmation,contactReference,type ContactInput,type NewsletterInput} from '@/config/forms';
import {sendContact,subscribeNewsletter} from '@/lib/forms.functions';
export function ContactForm(){
 const id=useId();const send=useServerFn(sendContact);const [error,setError]=useState('');const [success,setSuccess]=useState('');
 const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<ContactInput>({resolver:zodResolver(contactSchema),mode:'onBlur',defaultValues:{name:'',email:'',message:'',website:''}});
 const submit=handleSubmit(async data=>{setError('');try{const result=await send({data});if(!result.ok){setError(result.reason);return;}setSuccess(`${contactConfirmation(data.name,HOME.contact.replyHours.value)} ${HOME.form.reference}: ${contactReference(result.id)}`);}catch{setError(HOME.form.failure);}});
 if(success)return <div role="status" className="form-success">{success}</div>;
 return <form className="lead-form" onSubmit={submit} noValidate>
 <fieldset disabled={isSubmitting}><div className="form-pair">{(['name','email'] as const).map(field=><div key={field}><label htmlFor={`${id}-${field}`}>{HOME.form[field]}</label><input id={`${id}-${field}`} type={field==='email'?'email':'text'} autoComplete={field} maxLength={field==='name'?120:254} {...register(field)} aria-invalid={!!errors[field]} aria-describedby={errors[field]?`${id}-${field}-error`:undefined}/><span id={`${id}-${field}-error`} className="field-error">{errors[field]?.message}</span></div>)}</div>
 <label htmlFor={`${id}-message`}>{HOME.form.message}</label><textarea id={`${id}-message`} rows={3} maxLength={280} {...register('message')} aria-invalid={!!errors.message} aria-describedby={`${id}-message-error`}/><span id={`${id}-message-error`} className="field-error">{errors.message?.message}</span>
 <div className="honeypot" aria-hidden="true"><label htmlFor={`${id}-website`}>{HOME.form.honeypot}</label><input id={`${id}-website`} tabIndex={-1} autoComplete="off" {...register('website')}/></div>
 <Button type="submit" className="ink-button">{isSubmitting?HOME.form.sending:error?HOME.form.retry:HOME.form.send}</Button></fieldset>
 <div aria-live="polite" className="form-status">{isSubmitting?HOME.form.sending:error}</div>{error&&<MailFallback/>}
 </form>;
}
export function MailFallback(){return HOME.contact.email.value?<a className="form-mail" href={`mailto:${encodeURIComponent(HOME.contact.email.value)}`}>{HOME.form.mail}</a>:<p className="form-mail">{HOME.form.mailMissing}</p>;}
export function NewsletterForm(){
 const id=useId();const send=useServerFn(subscribeNewsletter);const [error,setError]=useState('');const [success,setSuccess]=useState(false);
 const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<NewsletterInput>({resolver:zodResolver(newsletterSchema),mode:'onBlur',defaultValues:{email:'',website:''}});
 const submit=handleSubmit(async data=>{setError('');try{const result=await send({data});if(result.ok)setSuccess(true);else setError(result.reason);}catch{setError(HOME.form.failure);}});
 return <form className="newsletter-form" onSubmit={submit} noValidate><label htmlFor={`${id}-email`}>{HOME.form.newsletter}</label>{!success&&<><div className="newsletter-fields"><input id={`${id}-email`} type="email" autoComplete="email" maxLength={254} aria-label="Newsletter email" aria-invalid={!!errors.email} aria-describedby={`${id}-error`} {...register('email')} disabled={isSubmitting}/><Button type="submit" disabled={isSubmitting}>{isSubmitting?HOME.form.sending:error?HOME.form.retry:HOME.form.subscribe}</Button></div><div className="honeypot" aria-hidden="true"><label htmlFor={`${id}-website`}>{HOME.form.honeypot}</label><input id={`${id}-website`} tabIndex={-1} autoComplete="off" {...register('website')}/></div></>}
 <div id={`${id}-error`} className="field-error">{errors.email?.message}</div><div aria-live="polite" className="form-status">{success?HOME.form.subscribed:isSubmitting?HOME.form.sending:error}</div>{error&&<MailFallback/>}</form>;
}