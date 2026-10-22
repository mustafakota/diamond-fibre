export const PROVISIONAL_WHATSAPP_NUMBER = '917974644185';
export const PROVISIONAL_DISPLAY_PHONE = '+91 7974644185';

export function getWhatsAppNumber(): string {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PROVISIONAL_WHATSAPP_NUMBER;
  return num.replace(/\D/g, '');
}

export function buildWhatsAppLink(message: string): string {
  const number = getWhatsAppNumber();
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${number}?text=${encodedText}`;
}

export function buildPhoneLink(): string {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || `+${PROVISIONAL_WHATSAPP_NUMBER}`;
  return `tel:${phone.replace(/\s+/g, '')}`;
}
