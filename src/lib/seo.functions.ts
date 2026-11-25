import {createServerFn} from '@tanstack/react-start';
import {getRequest} from '@tanstack/react-start/server';
import {POSTER_SHARE} from '@/content/media';
export const getHomeShareImage=createServerFn({method:'GET'}).handler(()=>{
 const request=getRequest();const url=new URL(request.url);
 // Only the sandbox rewrites localhost and sanitizes this header. Deployed hosts use the actual request URL.
 const sandboxHost=url.hostname==='localhost'?request.headers.get('x-forwarded-host'):null;
 const origin=sandboxHost?`https://${sandboxHost}`:url.origin;
 return origin.startsWith('https://')?new URL(POSTER_SHARE,origin).href:null;
});