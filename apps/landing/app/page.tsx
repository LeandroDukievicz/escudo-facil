import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';

export default function Page() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <HowItWorks />
      </main>
    </>
  );
}
