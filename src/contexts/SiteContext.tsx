import { createContext, useContext } from 'react';

interface SiteContextValue {
  siteId: string;
}

export const SiteContext = createContext<SiteContextValue>({ siteId: 'default' });

export const useSiteId = () => useContext(SiteContext).siteId;

/**
 * URL 경로에서 siteId를 파싱합니다.
 * 
 * /portfolio.development-pm/           → "default"
 * /portfolio.development-pm/a-game/    → "a-game"
 * /portfolio.development-pm/a-game     → "a-game"
 * localhost:5174/portfolio.development-pm/a-game/ → "a-game"
 */
export function parseSiteIdFromUrl(): string {
  const basePath = '/portfolio.development-pm/';
  const pathname = window.location.pathname;
  
  const idx = pathname.indexOf(basePath);
  if (idx === -1) return 'default';
  
  const afterBase = pathname.substring(idx + basePath.length);
  // afterBase examples: "", "a-game/", "a-game"
  const slug = afterBase.split('/')[0];
  
  return slug && slug.length > 0 ? slug : 'default';
}
