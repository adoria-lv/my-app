import HeroSlider from "./components/Slider";
import Services from "./components/Services";
import Experience from "./components/Experience";
import HomeInfo from "./components/HomeInfo";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import JaunumuPosts from "./components/BlogPosts";
import Info from "./components/Info";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <Services />
      <Experience />
      <HomeInfo />
      <Testimonials />
      <Contact />
      <JaunumuPosts />
      <Info />
      <FAQ />
      <Footer />
    </>
  )
}
