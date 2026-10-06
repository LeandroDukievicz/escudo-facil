import { describe, expect, it } from 'vitest';
import { maskSensitive } from '../src';

describe('maskSensitive', () => {
  it('oculta CPF, telefone e e-mail mantendo a pontuação', () => {
    const r = maskSensitive('CPF 123.456.789-09, tel (11) 98765-4321, email ana@mail.com');
    expect(r.text).toContain('███.███.███-██');
    expect(r.text).not.toMatch(/\d{4}-\d{4}/);
    expect(r.text).not.toContain('ana@mail.com');
    expect(r.counts).toMatchObject({ cpf: 1, phone: 1, email: 1 });
  });
  it('oculta chave Pix aleatória e cartão', () => {
    const r = maskSensitive('chave 123e4567-e89b-12d3-a456-426614174000 cartão 4111 1111 1111 1111');
    expect(r.counts.pix).toBe(1);
    expect(r.counts.card).toBe(1);
  });
  it('respeita a escolha do usuário', () => {
    const r = maskSensitive('ana@mail.com 123.456.789-09', ['email']);
    expect(r.text).toContain('123.456.789-09');
    expect(r.total).toBe(1);
  });
  it('endereço só quando habilitado', () => {
    const t = 'Moro na Rua das Flores, 123';
    expect(maskSensitive(t).text).toBe(t);
    expect(maskSensitive(t, ['address']).text).not.toContain('Flores');
  });
});
