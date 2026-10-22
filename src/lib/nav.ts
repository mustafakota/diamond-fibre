export type NavItem =
  | 'home'
  | 'products'
  | 'mattresses'
  | 'pillows'
  | 'razais'
  | 'blankets'
  | 'wholesale'
  | 'ourStory'
  | 'contact';

/**
 * Determines whether a navigation item should receive active highlight based on the current pathname and locale.
 *
 * Route Matching Rules:
 * - 'home': Active only on localized home ('/en', '/hi', or root '/')
 * - 'wholesale': Active only on '/en/wholesale', '/hi/wholesale', or un-prefixed fallback '/wholesale' (and child routes)
 * - 'ourStory': Active on '/en/our-story', '/hi/our-story', or '/our-story'
 * - 'contact': Active on '/en/contact', '/hi/contact', or '/contact'
 * - 'products': Active on '/en/products' and intended child routes (e.g. '/en/products/mattresses')
 * - 'mattresses' | 'pillows' | 'razais' | 'blankets': Active on their respective specific product category page
 */
export function isNavActive(
  pathname: string | null | undefined,
  locale: string,
  item: NavItem
): boolean {
  if (!pathname) return false;

  // Normalize: remove trailing slash, collapse empty to root
  const path = pathname.replace(/\/$/, '') || '/';
  const prefix = `/${locale}`;

  switch (item) {
    case 'home':
      return path === prefix || path === '/';

    case 'wholesale':
      return (
        path === `${prefix}/wholesale` ||
        path.startsWith(`${prefix}/wholesale/`) ||
        path === '/wholesale' ||
        path.startsWith('/wholesale/')
      );

    case 'ourStory':
      return (
        path === `${prefix}/our-story` ||
        path.startsWith(`${prefix}/our-story/`) ||
        path === '/our-story' ||
        path.startsWith('/our-story/')
      );

    case 'contact':
      return (
        path === `${prefix}/contact` ||
        path.startsWith(`${prefix}/contact/`) ||
        path === '/contact' ||
        path.startsWith('/contact/')
      );

    case 'products':
      return (
        path === `${prefix}/products` ||
        path.startsWith(`${prefix}/products/`) ||
        path === '/products' ||
        path.startsWith('/products/')
      );

    case 'mattresses':
      return (
        path === `${prefix}/products/mattresses` ||
        path.startsWith(`${prefix}/products/mattresses/`) ||
        path === '/products/mattresses' ||
        path.startsWith('/products/mattresses/')
      );

    case 'pillows':
      return (
        path === `${prefix}/products/pillows` ||
        path.startsWith(`${prefix}/products/pillows/`) ||
        path === '/products/pillows' ||
        path.startsWith('/products/pillows/')
      );

    case 'razais':
      return (
        path === `${prefix}/products/razais` ||
        path.startsWith(`${prefix}/products/razais/`) ||
        path === '/products/razais' ||
        path.startsWith('/products/razais/')
      );

    case 'blankets':
      return (
        path === `${prefix}/products/blankets` ||
        path.startsWith(`${prefix}/products/blankets/`) ||
        path === '/products/blankets' ||
        path.startsWith('/products/blankets/')
      );

    default:
      return false;
  }
}
