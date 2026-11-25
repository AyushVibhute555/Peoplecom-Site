import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home/HomePage";
import {SEO} from '@/content/seo';
import {getHomeShareImage} from '@/lib/seo.functions';

// Social cards use the absolute home poster.
export const Route = createFileRoute("/")({
  loader:async()=>({shareImage:await getHomeShareImage()}),
  head: ({loaderData}) => ({
    links: [{rel:'canonical',href:'/'}],
    scripts:[{type:'application/ld+json',children:JSON.stringify(SEO.organization)}],
    meta: [
      { title: SEO.title },
      { name: "description", content: SEO.description },
      { property: "og:title", content: SEO.title },
      { property: "og:description", content: SEO.description },
      {property:'og:url',content:'/'},
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(loaderData?.shareImage?[{property:'og:image',content:loaderData.shareImage},{name:'twitter:image',content:loaderData.shareImage},{property:'og:image:width',content:'1200'},{property:'og:image:height',content:'630'}]:[]),
    ],
  }),
  component: Index,
});

function Index() { return <HomePage />; }
