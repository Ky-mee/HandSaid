import { buildAlphabetAndNumbersForLanguage } from './alphabetAndNumbers';
import { ASL_EVERYDAY_SIGNS } from './aslSigns';
import { BIM_EVERYDAY_SIGNS } from './bimSigns';
import { ASL_EXTRA_SIGNS, BIM_EXTRA_SIGNS } from './extraSigns';
import type { SignDefinition } from './types';

export const BUILT_IN_SIGNS: SignDefinition[] = [
  ...buildAlphabetAndNumbersForLanguage('bim'),
  ...BIM_EVERYDAY_SIGNS,
  ...BIM_EXTRA_SIGNS,
  ...buildAlphabetAndNumbersForLanguage('asl'),
  ...ASL_EVERYDAY_SIGNS,
  ...ASL_EXTRA_SIGNS
];

export function getSignsForLanguage(languageId: string, customSigns: SignDefinition[]): SignDefinition[] {
  const builtIn = BUILT_IN_SIGNS.filter((s) => s.languageId === languageId);
  const custom = customSigns.filter((s) => s.languageId === languageId);
  return [...builtIn, ...custom];
}
