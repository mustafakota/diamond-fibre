import { en } from './en';
import { hi } from './hi';
import { Locale } from '@/lib/seo';

export function getDictionary(locale: Locale) {
  return locale === 'hi' ? hi : en;
}
