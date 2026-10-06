import { describe, expect, it } from 'vitest';
import { analyzeLink, parseLink } from '../src';

describe('parseLink', () => {
  it('aceita link sem esquema', () => {
    const p = parseLink('www.itau.com.br/conta');
    expect(p?.host).toBe('www.itau.com.br');
    expect(p?.registrableDomain).toBe('itau.com.br');
    expect(p?.schemeMissing).toBe(true);
  });
  it('separa subdomínios e domínio registrável', () => {
    const p = parseLink('http://seu-banco.verifique-conta.xyz/login');
    expect(p?.registrableDomain).toBe('verifique-conta.xyz');
    expect(p?.subdomains).toEqual(['seu-banco']);
    expect(p?.tld).toBe('xyz');
  });
  it('não aceita texto que não é link', () => {
    expect(parseLink('olá tudo bem')).toBeNull();
    expect(parseLink('')).toBeNull();
  });
  it('recusa endereços HTTP malformados', () => {
    for (const input of ['https:example.com', 'https://exa mple.com', 'https://evil.com:abc', 'https://evil.com:80:90']) {
      expect(parseLink(input)).toBeNull();
    }
  });
});

describe('analyzeLink', () => {
  it('domínio oficial conhecido → baixo risco, nunca "seguro"', () => {
    const r = analyzeLink('https://www.itau.com.br');
    expect(r.level).toBe('low');
    expect(r.title).toBe('Nenhum sinal grave encontrado agora');
    expect(r.checked.join(' ')).toContain('Itaú');
  });
  it('link encurtado → atenção', () => {
    const r = analyzeLink('https://bit.ly/xy7');
    expect(r.level).toBe('attention');
    expect(r.signals[0]?.id).toBe('url.shortener');
  });
  it('imitação de banco em .xyz → alto risco', () => {
    const r = analyzeLink('http://itau-seguranca.verifique-conta.xyz/login');
    expect(r.level).toBe('high');
    expect(r.signals.map((s) => s.category)).toContain('lookalike');
  });
  it('erro de digitação no nome do banco → alto risco', () => {
    expect(analyzeLink('https://nubamk.com.br').level).toBe('high');
    expect(analyzeLink('https://bradesc0.com').level).toBe('high');
  });
  it('punycode / caracteres estranhos → alto risco', () => {
    expect(analyzeLink('https://xn--itu-ula.com').level).toBe('high');
  });
  it('IP no lugar do nome e truque do @ → alto risco', () => {
    expect(analyzeLink('http://192.168.10.5/banco').level).toBe('high');
    expect(analyzeLink('https://www.caixa.gov.br@golpe.top/').level).toBe('high');
  });
  it('javascript: → alto risco', () => {
    expect(analyzeLink('javascript:alert(1)').level).toBe('high');
  });
  it('entrada inválida → inconclusivo com aviso de análise local', () => {
    const r = analyzeLink('isso não é um link');
    expect(r.level).toBe('unknown');
    expect(r.notice).toContain('regras locais');
  });
  it('nunca mostra mais de 5 sinais', () => {
    const r = analyzeLink('http://a.b.c.itau-bradesco-caixa-nubank.top/login/verificar/pix/token/x?a=1&b=2&c=3&d=4&e=5');
    expect(r.signals.length).toBeLessThanOrEqual(5);
  });
  it('subdomínio de gov.br é reconhecido como oficial', () => {
    expect(analyzeLink('https://meu.inss.gov.br').level).toBe('low');
  });
});
