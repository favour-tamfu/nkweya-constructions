import { Bitter, Libre_Franklin } from 'next/font/google';

export const bitter = Bitter({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '700', '800'],
  variable: '--font-bitter',
  display: 'swap',
});

export const franklin = Libre_Franklin({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-franklin',
  display: 'swap',
});
