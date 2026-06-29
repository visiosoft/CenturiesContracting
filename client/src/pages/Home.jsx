import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import About from '../components/About';
import Projects from '../components/Projects';
import BeforeAfter from '../components/BeforeAfter';
import WhyUs from '../components/WhyUs';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <About />
      <Projects />
      <BeforeAfter />
      <WhyUs />
      <Testimonials />
      <CTA />
      <Contact />
    </>
  );
}
