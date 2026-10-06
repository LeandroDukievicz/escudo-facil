import { describe, expect, it } from 'vitest';
import { linkContentForAi, sanitizeAiRequest, validateAiResponse, type AiAnalysisRequest } from '../src';

describe('privacidade da análise com IA', () => {
  it('remove credenciais, caminho e parâmetros de links', () => {
    expect(linkContentForAi('https://usuario:senha@itau.com.br/conta/123456?token=segredo#fragmento'))
      .toBe('Domínio analisado: itau.com.br');
  });

  it('não envia trechos dos sinais e mascara dados do texto', () => {
    const request: AiAnalysisRequest = {
      kind: 'text', content: 'CPF 123.456.789-09', locale: 'pt-BR',
      local: { level: 'high', signals: [{ id: 'x', category: 'documents', severity: 'strong', label: 'Pede documento', excerpt: '123.456.789-09' }] },
    };
    const safe = sanitizeAiRequest(request);
    expect(JSON.stringify(safe)).not.toContain('123.456.789-09');
    expect(safe.local.signals[0]?.excerpt).toBeUndefined();
  });

  it('recusa respostas malformadas ou que declaram segurança absoluta', () => {
    const base = { level: 'low', title: 'Pode clicar', intent: 'Confira o canal oficial', reasons: [], known: [], unknown: [], actions: [] };
    expect(() => validateAiResponse(base, 'high')).toThrow();
    expect(validateAiResponse({ ...base, level: 'high' }, 'low').title).toBe('Alto risco de golpe');
    expect(() => validateAiResponse({ ...base, intent: 'Este link é 100% seguro' }, 'low')).toThrow();
    expect(() => validateAiResponse({ ...base, known: null }, 'low')).toThrow();
  });
});
