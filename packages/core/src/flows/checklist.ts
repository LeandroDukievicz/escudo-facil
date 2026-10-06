import type { RiskLevel } from '../types';

export interface ChecklistItem {
  id: string;
  text: string;
  /** Itens graves sozinhos já justificam alto risco. */
  critical: boolean;
}

/** Checklist anti-golpe (tela E5). */
export const CHECKLIST: ChecklistItem[] = [
  { id: 'password', text: 'Pediram sua senha?', critical: true },
  { id: 'code', text: 'Pediram um código?', critical: true },
  { id: 'pix', text: 'Pediram Pix urgente?', critical: true },
  { id: 'link', text: 'O link parece estranho?', critical: false },
  { id: 'secret', text: 'A pessoa quer segredo?', critical: false },
  { id: 'too-good', text: 'Oferta boa demais?', critical: false },
  { id: 'unknown-number', text: 'Número desconhecido?', critical: false },
];

export interface ChecklistVerdict {
  count: number;
  level: RiskLevel;
  message: string;
}

export function evaluateChecklist(checked: ReadonlySet<string> | string[]): ChecklistVerdict {
  const set = new Set(checked);
  const marked = CHECKLIST.filter((i) => set.has(i.id));
  const count = marked.length;
  const critical = marked.some((i) => i.critical);
  if (count === 0) {
    return {
      count,
      level: 'low',
      message: 'Nenhum sinal marcado. Ainda assim, confirme pelo canal oficial antes de pagar.',
    };
  }
  const plural = count === 1 ? '1 sinal marcado' : `${count} sinais marcados`;
  if (critical || count >= 3) {
    return { count, level: 'high', message: `${plural} → cuidado. Não envie nada ainda.` };
  }
  return { count, level: 'attention', message: `${plural} → atenção. Confirme antes de agir.` };
}
