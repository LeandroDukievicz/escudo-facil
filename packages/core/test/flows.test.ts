import { describe, expect, it } from 'vitest';
import { evaluateChecklist, QUESTIONS, scoreQuestionnaire } from '../src';

describe('questionário', () => {
  it('tem as 8 perguntas do briefing', () => {
    expect(QUESTIONS).toHaveLength(8);
  });
  it('Pix + urgência + banco + não conhece → alto risco "Melhor parar"', () => {
    const r = scoreQuestionnaire({ money: 'yes', urgency: 'yes', authority: 'yes', knows: 'no', credentials: 'no' });
    expect(r.level).toBe('high');
    expect(r.headline).toBe('Melhor parar antes de continuar');
    expect(r.marked).toEqual(['Pede Pix', 'Urgência', 'Se passou por banco', 'Não conhece']);
  });
  it('tudo "não" e conhece a pessoa → baixo risco', () => {
    const answers = Object.fromEntries(QUESTIONS.map((q) => [q.id, q.riskyAnswer === 'yes' ? 'no' : 'yes'] as const));
    expect(scoreQuestionnaire(answers).level).toBe('low');
  });
  it('muitos "não sei" → inconclusivo', () => {
    const answers = Object.fromEntries(QUESTIONS.map((q) => [q.id, 'unknown'] as const));
    expect(scoreQuestionnaire(answers).level).toBe('unknown');
  });
  it('pedir para instalar app sozinho já é alto risco', () => {
    expect(scoreQuestionnaire({ install: 'yes' }).level).toBe('high');
  });
});

describe('checklist', () => {
  it('2 sinais críticos → cuidado', () => {
    const v = evaluateChecklist(['password', 'code']);
    expect(v.level).toBe('high');
    expect(v.message).toBe('2 sinais marcados → cuidado. Não envie nada ainda.');
  });
  it('1 sinal não crítico → atenção', () => {
    expect(evaluateChecklist(['secret']).level).toBe('attention');
  });
  it('nenhum → baixo, com lembrete', () => {
    expect(evaluateChecklist([]).message).toContain('canal oficial');
  });
});
