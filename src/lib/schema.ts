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
  breadcrumbs?: BreadcrumbItem[];
  itemList?: { name: string; description: string; books: SchemaBook[] };
  faq?: { q: string; a: string }[];
  isSearchPage?: boolean;
}

export function buildGraph(opts: BuildGraphOptions) {
  const site = SITE.url;
  // Reviews and articles are produced by the Capital Reads team, not a
  // named individual, so authorship is attributed to the Organization
  // rather than a fabricated Person.
  const author = { '@id': `${site}/#org` };

  const graph: Record<string, unknown>[] = [
    { '@type': 'WebSite', '@id': `${site}/#website`, name: SITE.brand, url: site, publisher: { '@id': `${site}/#org` } },
    { '@type': 'Organization', '@id': `${site}/#org`, name: SITE.brand, url: site, description: SITE.tagline },
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
      headline: opts.pageTitle,
      author,
      publisher: { '@id': `${site}/#org` },
      dateModified: opts.dateModified,
      isAccessibleForFree: true,
    });
  } else {
    graph.push({ '@type': 'SearchResultsPage', name: `${SITE.brand} — Search`, isPartOf: { '@id': `${site}/#website` } });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
