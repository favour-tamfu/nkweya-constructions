import { describe, expect, it } from 'vitest';
import { displayPhone, telHref, whatsappHref } from './whatsapp';
import { formatFcfa, formatFcfaShort, formatSqm } from './format';

describe('whatsappHref', () => {
  it('strips everything but digits — wa.me rejects + and spaces (§4.2)', () => {
    const href = whatsappHref('+237 656 766 513', 'Hello');
    expect(href).toBe('https://wa.me/237656766513?text=Hello');
  });

  it('encodes the message, including accents and newlines', () => {
    const href = whatsappHref('+237656766513', 'Devis pour études géotechniques\nà Douala');
    expect(href).toContain('%C3%A9tudes');
    expect(href).toContain('%0A');
    expect(href).not.toContain(' ');
  });
});

describe('telHref', () => {
  it('produces a dialable international number', () => {
    expect(telHref('+237 692 704 279')).toBe('tel:+237692704279');
  });
});

describe('displayPhone', () => {
  it('groups a Cameroonian number the way it is written locally', () => {
    expect(displayPhone('+237656766513')).toBe('+237 656 766 513');
  });

  it('leaves anything it does not recognise alone', () => {
    expect(displayPhone('01234')).toBe('01234');
  });
});

describe('formatFcfa', () => {
  // U+202F narrow no-break space: correct FCFA typography, and non-breaking so
  // a figure can never wrap across two lines on a narrow phone.
  const sep = ' ';

  it('groups thousands with a narrow no-break space, and never shows centimes', () => {
    expect(formatFcfa(12_500_000, 'en')).toBe(`12${sep}500${sep}000 FCFA`);
    expect(formatFcfa(12_500_000, 'fr')).toBe(`12${sep}500${sep}000 FCFA`);
  });

  it('uses a separator that cannot break across lines', () => {
    expect(formatFcfa(12_500_000, 'en')).not.toContain('12 500');
  });

  it('rounds rather than showing a fraction of a franc', () => {
    expect(formatFcfa(1234.6, 'en')).toBe(`1${sep}235 FCFA`);
  });
});

describe('formatFcfaShort', () => {
  it('uses the locale decimal mark', () => {
    expect(formatFcfaShort(1_500_000, 'en')).toBe('1.5 M FCFA');
    expect(formatFcfaShort(1_500_000, 'fr')).toBe('1,5 M FCFA');
  });

  it('drops the decimal above ten million, where it is noise', () => {
    expect(formatFcfaShort(24_000_000, 'en')).toBe('24 M FCFA');
  });
});

describe('formatSqm', () => {
  it('writes square metres with the locale decimal mark', () => {
    expect(formatSqm(120, 'en')).toBe('120 m²');
    expect(formatSqm(120.5, 'fr')).toBe('120,5 m²');
  });
});
