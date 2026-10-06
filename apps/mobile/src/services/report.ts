import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export interface CaseSummary {
  what: string;
  channel: string;
  amount: string;
  signals: string;
  evidence: string;
  generatedAt: Date;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export function caseSummaryText(c: CaseSummary): string {
  return [
    `Resumo do caso — gerado pelo Escudo Fácil em ${c.generatedAt.toLocaleString('pt-BR')}`,
    `O que houve: ${c.what || '—'}`,
    `Canal: ${c.channel || '—'}`,
    `Valor enviado: ${c.amount || 'nenhum'}`,
    `Sinais: ${c.signals || '—'}`,
    `Provas: ${c.evidence || '—'}`,
  ].join('\n');
}

/** "Salvar em PDF" do resumo do caso (G2), para levar ao banco e ao B.O. */
export async function exportCasePdf(c: CaseSummary): Promise<void> {
  const row = (k: string, v: string) => `<p><b>${k}:</b> ${esc(v || '—')}</p>`;
  const html = `<html><head><meta charset="utf-8"/></head>
  <body style="font-family: sans-serif; padding: 32px; font-size: 16px; color: #16263a">
    <h1 style="color:#a02020">Resumo do caso</h1>
    <p style="color:#6b7280">Gerado pelo Escudo Fácil · ${esc(c.generatedAt.toLocaleString('pt-BR'))}</p>
    ${row('O que houve', c.what)}${row('Canal', c.channel)}${row('Valor enviado', c.amount)}
    ${row('Sinais', c.signals)}${row('Provas', c.evidence)}
    <p style="margin-top:24px;padding:12px;border:2px solid #1f9d57;border-radius:8px">
      Leve este resumo ao banco e ao boletim de ocorrência.</p>
  </body></html>`;
  const { uri } = await Print.printToFileAsync({ html });
  if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
}
