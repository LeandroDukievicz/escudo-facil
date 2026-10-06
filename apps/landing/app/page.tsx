import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { TrafficLight } from '@/components/TrafficLight';
import { TryIt } from '@/components/TryIt';
import { NoPressure } from '@/components/NoPressure';

export default function Page() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <HowItWorks />
        <TryIt />
        <TrafficLight />
        <NoPressure />
      </main>
    </>
  );
}
