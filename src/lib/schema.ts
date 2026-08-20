import { SITE } from '../config';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface SchemaBook {
  title: string;
  author: string;
  published: string;
  blurb: string;
}

export interface BuildGraphOptions {
  pageTitle: string;
  dateModified: string;
  datePublished?: string;
  path?: string;
  image?: string;
  breadcrumbs?: BreadcrumbItem[];
  itemList?: { name: string; description: string; books: SchemaBook[] };
  faq?: { q: string; a: string }[];
  isSearchPage?: boolean;
}

export function buildGraph(opts: BuildGraphOptions) {
  const site = SITE.url;
  const pageUrl = `${site}${opts.path ?? '/'}`;
  const image = opts.image ?? `${site}/og-image.png`;
  // Reviews and articles are produced by the Capital Readers team, not a
  // named individual, so authorship is attributed to the Organization
  // rather than a fabricated Person.
  const author = { '@id': `${site}/#org` };

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      '@id': `${site}/#website`,
      name: SITE.brand,
      url: site,
      inLanguage: 'en-US',
      publisher: { '@id': `${site}/#org` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${site}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${site}/#org`,
      name: SITE.brand,
      url: site,
      description: SITE.tagline,
      logo: { '@type': 'ImageObject', url: `${site}/icon-512.png`, width: 512, height: 512 },
    },
  ];

  if (opts.itemList) {
    graph.push({
      '@type': 'ItemList',
      name: opts.itemList.name,
      description: opts.itemList.description,
      numberOfItems: opts.itemList.books.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: opts.itemList.books.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Book',
          name: b.title,
          author: { '@type': 'Person', name: b.author },
          datePublished: b.published,
          review: { '@type': 'Review', reviewBody: b.blurb, author },
        },
      })),
    });
  }

  if (opts.breadcrumbs && opts.breadcrumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: opts.breadcrumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: site + c.path,
      })),
    });
  }

  if (opts.faq && opts.faq.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: opts.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  if (!opts.isSearchPage) {
    graph.push({
      '@type': 'Article',
      '@id': `${pageUrl}#article`,
      mainEntityOfPage: pageUrl,
      headline: opts.pageTitle,
      image,
      author,
      publisher: { '@id': `${site}/#org` },
      datePublished: opts.datePublished ?? opts.dateModified,
      dateModified: opts.dateModified,
      inLanguage: 'en-US',
      isAccessibleForFree: true,
    });
  } else {
    graph.push({ '@type': 'SearchResultsPage', name: `${SITE.brand} — Search`, isPartOf: { '@id': `${site}/#website` } });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
