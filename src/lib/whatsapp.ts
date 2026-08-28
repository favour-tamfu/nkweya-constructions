export const whatsappHref = (phone: string, message: string) =>
  `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

export function telHref(phone: string) {
  return `tel:+${phone.replace(/\D/g, '')}`;
}

export function displayPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('237') && digits.length === 12) {
    return `+237 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return phone;
}
