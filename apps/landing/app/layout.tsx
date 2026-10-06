import type { Metadata, Viewport } from 'next';
import { Asap, Gaegu } from 'next/font/google';
import { buildCssVars } from '@/lib/cssVars';
import './globals.css';

const asap = Asap({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-asap',
  display: 'swap',
});

const gaegu = Gaegu({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-gaegu',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Escudo Fácil — Antes de clicar, verifique.',
  description:
    'App anti-golpe para pessoas leigas, idosos e familiares. Verifique links, prints e mensagens suspeitas em poucos segundos, sem cadastro e até sem internet.',
  applicationName: 'Escudo Fácil',
  keywords: ['golpe', 'golpe do pix', 'link suspeito', 'segurança digital', 'idosos', 'whatsapp', 'phishing'],
  openGraph: {
    title: 'Escudo Fácil — Antes de clicar, verifique.',
    description: 'Analise links, prints e mensagens suspeitas em poucos segundos. Sem cadastro.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563a8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${asap.variable} ${gaegu.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: buildCssVars() }} />
      </head>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
