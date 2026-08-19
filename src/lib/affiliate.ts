import { SITE } from '../config';

export function amazonUrl(title: string, author: string, override?: string): string {
  if (override) return override;
  const q = encodeURIComponent(`${title} ${author}`);
  return `https://www.amazon.com/s?k=${q}&tag=${SITE.amazonTag}`;
}

export function bookshopUrl(title: string, override?: string): string {
  if (override) return override;
  const q = encodeURIComponent(title);
  return `https://bookshop.org/beta-search?keywords=${q}&aid=${SITE.bookshopId}`;
}

const GRADIENTS = [
  'linear-gradient(160deg,#7a2e2e,#4f1c1c)',
  'linear-gradient(160deg,#1f2b3a,#101822)',
  'linear-gradient(160deg,#8a6d3f,#5c4a26)',
  'linear-gradient(160deg,#3c5546,#223026)',
  'linear-gradient(160deg,#5c4a3f,#332821)',
];

export function gradientFor(index: number): string {
  return GRADIENTS[index % GRADIENTS.length];
}

export function coverAlt(title: string, author: string): string {
  return `Cover of ${title} by ${author}`;
}

export function rankLabel(index: number): string {
  return String(index + 1).padStart(2, '0');
}
