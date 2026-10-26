import { en, type TranslationSchema } from './ui.en';
import { vi } from './ui.vi';

export const languages = {
  en: 'English',
  vi: 'Tiếng Việt',
} as const;

export type SupportedLanguage = keyof typeof languages;

export const defaultLang: SupportedLanguage = 'en';

export const ui = {
  en,
  vi,
} as const;

export function getLangFromUrl(url: URL): SupportedLanguage {
  const [, lang] = url.pathname.split('/');
  if (lang === 'vi') return 'vi';
  return defaultLang;
}

export function useTranslations(lang: SupportedLanguage) {
  return function t<
    Section extends keyof TranslationSchema,
    Key extends keyof TranslationSchema[Section],
  >(section: Section, key: Key): string {
    const currentSection = ui[lang][section];
    const defaultSection = ui[defaultLang][section];
    return (currentSection[key] ?? defaultSection[key]) as string;
  };
}

export function getLocalizedPath(path: string, lang: SupportedLanguage): string {
  const cleanPath = path.startsWith('/vi') ? path.replace(/^\/vi/, '') : path;
  const normalized = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  if (lang === 'vi') {
    return `/vi${normalized === '/' ? '/' : normalized}`;
  }
  return normalized;
}

export function getAlternateLang(lang: SupportedLanguage): SupportedLanguage {
  return lang === 'en' ? 'vi' : 'en';
}
