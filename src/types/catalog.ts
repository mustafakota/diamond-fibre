export type CategoryKey = 'mattresses' | 'pillows' | 'razais' | 'blankets';

export interface LocalizedString {
  en: string;
  hi: string;
}

export interface ConfirmedDimension {
  name: LocalizedString;
  dimensionsFeet: string;
  availabilityNote?: LocalizedString;
}

export interface RepresentativeImage {
  src: string;
  alt: LocalizedString;
  isRepresentative: true;
  caption?: LocalizedString;
}

export interface CategoryData {
  key: CategoryKey;
  slug: string;
  name: LocalizedString;
  shortTag: LocalizedString;
  tagline: LocalizedString;
  overview: LocalizedString;
  // Representative seasonal imagery
  representativeImages: RepresentativeImage[];
  // Confirmed standard sizes where verified
  confirmedDimensions: ConfirmedDimension[];
  // Clear note that dimension availability depends on model
  dimensionAvailabilityNote?: LocalizedString;
  // WhatsApp inquiry template
  whatsappPrefill: LocalizedString;
}
