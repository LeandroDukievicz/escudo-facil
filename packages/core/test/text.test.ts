import { describe, expect, it } from 'vitest';
import { analyzeText, normalizeText } from '../src';

const GOLPE =
  'Olá, aqui é do banco. Sua conta será bloqueada hoje. Confirme o código e a senha ou faça um Pix de R$ 250 para regularizar. bit.ly/xy7';

describe('analyzeText', () => {
  it('mensagem clássica de falso banco → alto risco com trechos destacados', () => {
    const a = analyzeText(GOLPE);
    expect(a.result.level).toBe('high');
    const cats = a.highlights.map((h) => h.category);
    expect(cats).toEqual(expect.arrayContaining(['urgency', 'credentials', 'money', 'hidden-link']));
    expect(a.pressure).toBe(true);
    expect(a.scamType).toBe('falso banco');
    expect(a.links).toEqual(['bit.ly/xy7']);
    expect(a.result.summary).toContain('pressa');
  });
  it('destaques apontam para o texto original (com acento)', () => {
    const a = analyzeText(GOLPE);
    for (const h of a.highlights) expect(GOLPE.slice(h.start, h.end)).toBe(h.text);
    expect(a.highlights.find((h) => h.category === 'urgency')?.text).toMatch(/será bloqueada/);
  });
  it('falso parente', () => {
    const a = analyzeText('Oi mãe, troquei de número, salva esse contato. Me manda um pix urgente?');
    expect(a.scamType).toBe('falso parente');
    expect(a.result.level).not.toBe('low');
  });
  it('acesso remoto → alto risco', () => {
    const a = analyzeText('Sou do suporte técnico, instale o aplicativo AnyDesk para resolver.');
    expect(a.result.level).toBe('high');
  });
  it('mensagem comum → baixo risco', () => {
    const a = analyzeText('Oi, tudo bem? Vamos almoçar no domingo na casa da vó?');
    expect(a.result.level).toBe('low');
    expect(a.highlights).toHaveLength(0);
  });
  it('texto curto demais → inconclusivo', () => {
    expect(analyzeText('ok').result.level).toBe('unknown');
  });
  it('normalizeText preserva o tamanho', () => {
    const s = 'Ação ÚLTIMO aviso çãõ';
    expect(normalizeText(s)).toHaveLength(s.length);
    expect(normalizeText(s)).toBe('acao ultimo aviso cao');
  });
});
