import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import UpcomingEvents from '../components/landing/UpcomingEvents';
import FeaturedEvents from '../components/landing/FeaturedEvents';
import Gallery from '../components/landing/Gallery';
import Testimonials from '../components/landing/Testimonials';
import Contact from '../components/landing/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <UpcomingEvents />
      <FeaturedEvents />
      <Gallery />
      <Testimonials />
      <Contact />
    </>
  );
}
