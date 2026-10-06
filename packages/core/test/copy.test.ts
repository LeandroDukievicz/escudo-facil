import { describe, expect, it } from 'vitest';
import * as core from '../src';

/** Varre todo texto exportado pelo core em busca de frases proibidas. */
function collectStrings(v: unknown, out: string[] = []): string[] {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => collectStrings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => collectStrings(x, out));
  return out;
}

describe('regra: nunca declarar "seguro"', () => {
  const { FORBIDDEN_PHRASES, AI_SYSTEM_PROMPT, findForbiddenPhrases, ...rest } = core;
  it('nenhum texto do app usa frase proibida', () => {
    const offenders = collectStrings(rest).filter((s) => findForbiddenPhrases(s).length);
    expect(offenders).toEqual([]);
  });
  it('resultados gerados também respeitam a regra', () => {
    for (const input of ['https://www.itau.com.br', 'bit.ly/x', 'http://itau.xyz', '???']) {
      const r = core.analyzeLink(input);
      expect(findForbiddenPhrases(JSON.stringify(r))).toEqual([]);
    }
  });
  it('detecta frases proibidas', () => {
    expect(findForbiddenPhrases('Link seguro, pode clicar')).toEqual(['link seguro', 'pode clicar']);
  });
});
