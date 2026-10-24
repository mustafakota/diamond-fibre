export const DEFAULT_WHATSAPP_NUMBER = '917974644185';
export const DEFAULT_DISPLAY_PHONE = '+91 7974644185';
export const BUSINESS_EMAIL = 'diamondfibreandcotton@gmail.com';
export const BUSINESS_LOCATION = 'Ratlam, Madhya Pradesh, India';
export const GOOGLE_MAPS_LISTING_URL = 'https://maps.google.com/?cid=9316049051871516981';
export const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/diamondfibres/';

// Aliases for backwards compatibility with any existing imports
export const PROVISIONAL_WHATSAPP_NUMBER = DEFAULT_WHATSAPP_NUMBER;
export const PROVISIONAL_DISPLAY_PHONE = DEFAULT_DISPLAY_PHONE;

export function getWhatsAppNumber(): string {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  return num.replace(/\D/g, '');
}

export function buildWhatsAppLink(message: string): string {
  const number = getWhatsAppNumber();
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${number}?text=${encodedText}`;
}

export function buildPhoneLink(): string {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || `+${DEFAULT_WHATSAPP_NUMBER}`;
  return `tel:${phone.replace(/\s+/g, '')}`;
}
