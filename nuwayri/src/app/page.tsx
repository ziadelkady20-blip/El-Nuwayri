import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProductsSection from '@/components/sections/ProductsSection';
import WhyAndPortfolio from '@/components/sections/WhyAndPortfolio';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/ui/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <ProductsSection />
      <WhyAndPortfolio />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
