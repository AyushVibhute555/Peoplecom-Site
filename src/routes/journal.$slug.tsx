import {createFileRoute,notFound} from '@tanstack/react-router';
import {HOME} from '@/content/home';
import {PAGES,pageHead} from '@/content/pages';
import {ComingSoon} from '@/components/home/ComingSoon';
export const Route=createFileRoute('/journal/$slug')({loader:({params})=>{const article=HOME.journal.find(post=>post.slug===params.slug);if(!article)throw notFound();return article;},head:({loaderData,params})=>pageHead(loaderData?.title??'Journal story unavailable',loaderData?`Peoplecom journal: ${loaderData.title}`:PAGES.journal.description,`/journal/${encodeURIComponent(params.slug)}`),component:JournalPost});
function JournalPost(){const post=Route.useLoaderData();return <ComingSoon title={post.title} line={PAGES.article.line}/>;}