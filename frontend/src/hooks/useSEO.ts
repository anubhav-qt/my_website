import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description: string;
  path: string;
}

const SITE_URL = 'https://anubhav-qt.dev';
const SITE_NAME = 'Anubhav Joshi';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// Sets meta description and OG/Twitter tags per page. Doesn't touch document.title: this
// app keeps every visited page mounted (just hidden) instead of unmounting on navigation
// (see App.tsx), so this effect only runs once per page, on first visit. Setting the tab
// title here would mean whichever page you visited last "wins" and sticks even after you
// navigate elsewhere, so the tab title is left as the static one from index.html instead.
export function useSEO({ title, description, path }: SEOOptions) {
  useEffect(() => {
    const fullTitle = path === '/' ? title : `${title}, ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;

    setMeta('name', 'description', description);
    setLink('canonical', url);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:image', `${SITE_URL}/og-image.png`);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', `${SITE_URL}/og-image.png`);
  }, [title, description, path]);
}
