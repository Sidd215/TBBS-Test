import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

// --------------------
// Assets & sample data
// --------------------
const SAMPLE_IMAGES = {
  service1: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800',
  service2: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
  service3: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
  service4: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  project1: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800',
  project2: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
  project3: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
  project4: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800',
  project5: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800',
  project6: 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=800'
};

const LOGO_URL = '/images/BBSLogo.png';

const services = [
  {
    id: 1,
    title: '3D Animation',
    description: 'Professional 3D animation services',
    image: SAMPLE_IMAGES.service1,
    details:
      'We create stunning 3D animations that bring your ideas to life with cutting-edge technology and creative excellence.',
    samples: [SAMPLE_IMAGES.service1, SAMPLE_IMAGES.service2, SAMPLE_IMAGES.service3]
  },
  {
    id: 2,
    title: 'CGI Animation',
    description: 'High-quality CGI animation',
    image: SAMPLE_IMAGES.service2,
    details:
      'Our CGI animation services deliver photorealistic visuals and compelling storytelling for films, commercials, and digital content.',
    samples: [SAMPLE_IMAGES.service2, SAMPLE_IMAGES.service3, SAMPLE_IMAGES.service4]
  },
  {
    id: 3,
    title: 'Creative Campaigns',
    description: 'Innovative marketing campaigns',
    image: SAMPLE_IMAGES.service3,
    details:
      'We design and execute creative campaigns that captivate audiences and drive brand engagement across all platforms.',
    samples: [SAMPLE_IMAGES.service3, SAMPLE_IMAGES.service4, SAMPLE_IMAGES.service1]
  },
  {
    id: 4,
    title: '3D Still Images',
    description: 'Photorealistic 3D renders',
    image: SAMPLE_IMAGES.service4,
    details:
      'Our 3D still images provide photorealistic visualization for products, architecture, and conceptual designs.',
    samples: [SAMPLE_IMAGES.service4, SAMPLE_IMAGES.service1, SAMPLE_IMAGES.service2]
  }
];

const projects = [
  {
    id: 1,
    title: 'Project Alpha',
    description: 'A revolutionary animation project',
    image: SAMPLE_IMAGES.project1,
    details:
      'Project Alpha showcases our expertise in creating immersive animated experiences with stunning visual effects.',
    images: [SAMPLE_IMAGES.project1, SAMPLE_IMAGES.project2],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 2,
    title: 'Project Beta',
    description: 'Cutting-edge CGI work',
    image: SAMPLE_IMAGES.project2,
    details:
      'Project Beta demonstrates our ability to blend reality with imagination through advanced CGI techniques.',
    images: [SAMPLE_IMAGES.project2, SAMPLE_IMAGES.project3],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 3,
    title: 'Project Gamma',
    description: 'Creative campaign success',
    image: SAMPLE_IMAGES.project3,
    details:
      'Project Gamma is a testament to our creative campaign strategies that drive results and engagement.',
    images: [SAMPLE_IMAGES.project3, SAMPLE_IMAGES.project4],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 4,
    title: 'Project Delta',
    description: 'Architectural visualization',
    image: SAMPLE_IMAGES.project4,
    details:
      'Project Delta features photorealistic architectural visualization that brings designs to life.',
    images: [SAMPLE_IMAGES.project4, SAMPLE_IMAGES.project5],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 5,
    title: 'Project Epsilon',
    description: 'Character animation showcase',
    image: SAMPLE_IMAGES.project5,
    details:
      'Project Epsilon highlights our character animation expertise with fluid movements and expressive designs.',
    images: [SAMPLE_IMAGES.project5, SAMPLE_IMAGES.project6],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 6,
    title: 'Project Zeta',
    description: 'Motion graphics mastery',
    image: SAMPLE_IMAGES.project6,
    details:
      'Project Zeta showcases our motion graphics capabilities with dynamic and engaging visual content.',
    images: [SAMPLE_IMAGES.project6, SAMPLE_IMAGES.project1],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 7,
    title: 'Project Eta',
    description: 'Brand identity animation',
    image: SAMPLE_IMAGES.project1,
    details:
      'Project Eta brings brand identities to life through captivating animated sequences and visual storytelling.',
    images: [SAMPLE_IMAGES.project1, SAMPLE_IMAGES.project3],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 8,
    title: 'Project Theta',
    description: 'Interactive media experience',
    image: SAMPLE_IMAGES.project2,
    details:
      'Project Theta showcases our ability to create engaging interactive media experiences that captivate audiences.',
    images: [SAMPLE_IMAGES.project2, SAMPLE_IMAGES.project4],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];

// --------------------
// App Component
// --------------------
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  const NAVBAR_HEIGHT = 80;

  useEffect(() => {
    const update = () => {
      const heroEl = document.getElementById('hero');
      const heroHeight = heroEl?.getBoundingClientRect().height || 0;

      const shouldBeScrolled =
        window.scrollY > Math.max(50, heroHeight - NAVBAR_HEIGHT - 20);

      setScrolledPastHero(prev => (prev !== shouldBeScrolled ? shouldBeScrolled : prev));
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentPage]);

  const scrollToSection = (id, ensureHome = false) => {
    if (ensureHome) {
      setCurrentPage('home');
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          const y = window.scrollY + el.getBoundingClientRect().top - NAVBAR_HEIGHT + 8;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;
    const y = window.scrollY + el.getBoundingClientRect().top - NAVBAR_HEIGHT + 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // -------------------------
  // NAVBAR
  // -------------------------
  const Navbar = () => (
    <nav
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-300"
      style={{ width: '90%', maxWidth: '1150px', height: NAVBAR_HEIGHT }}
    >
      <div
        className={`
          w-full h-full flex items-center justify-between px-6 
          rounded-3xl border backdrop-blur-2xl transition-all duration-300
          ${scrolledPastHero ? 'bg-white/10 bg-opacity-20 border-white/20' : 'bg-white/10 bg-opacity-10 border-white/10'}

        `}
      >
        <img
          src={LOGO_URL}
          alt="Big Brain Studios"
          className="h-30 w-auto"
        />
     
        <div className="flex items-center space-x-8 text-white font-medium">
          <button
            onClick={() => scrollToSection('hero', true)}
            className="transition-colors duration-300"
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection('about', true)}
            className="transition-colors duration-300"
          >
            About
          </button>

          <button
            onClick={() => setCurrentPage('services')}
            className="transition-colors duration-300"
          >
            Services
          </button>

          <button
            onClick={() => setCurrentPage('projects')}
            className="transition-colors duration-300"
          >
            Projects
          </button>

          <button
            onClick={() => scrollToSection('contact', true)}
            className="bg-red-600 px-5 py-2 rounded-xl hover:bg-red-700 transition-all duration-300"
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );

  // -------------------------
  // HOME
  // -------------------------
  const Home = () => {
    const [activeService, setActiveService] = useState(0);

    return (
      <div className="bg-[#0d0004] text-white min-h-screen">
        {/* Hero */}
        <section id="hero" className="relative h-screen w-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/Creta.mp4" type="video/mp4" />
          </video>

          <div className="absolute top-0 left-0 w-full h-full bg-black/60" />

          <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
            <div>
              <h1 className="text-6xl md:text-8xl font-black">
                Welcome to <span className="text-red-600">Big Brain Studios</span>
              </h1>

              <p className="text-2xl mt-6 font-light">
                Your Premier Animation Partner
              </p>

              <div className="h-1 w-32 bg-red-600 mx-auto my-8" />

              <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
                We bring imagination to life through cutting-edge animation, CGI, and creative campaigns.
              </p>

              <div className="mt-10">
                <button
                  onClick={() => scrollToSection('services-section', true)}
                  className="bg-red-600 px-8 py-3 rounded text-lg font-bold hover:bg-red-700 transition"
                >
                  Explore Our Work
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Services interactive */}
        <section
          id="services-section"
          className="pt-24 pb-20 px-4 bg-[#0d0004]"
          style={{ paddingTop: NAVBAR_HEIGHT + 24 }}
        >
          <div className="container mx-auto">
            <div className="text-center mb-12" style={{ opacity: 1 }}>
              <p className="text-red-600 text-sm tracking-widest mb-4 font-bold">OUR EXPERTISE</p>
              <h2 className="text-white text-3xl md:text-4xl max-w-3xl mx-auto font-light">
                Here to help with everything from small updates to full-scale redesigns, tailored to your evolving needs.
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto items-start">
              {/* LEFT PREVIEW */}
              <div className="lg:w-2/5" style={{ opacity: 1 }}>
                <div
                  className="bg-[#0a0a0a] border border-red-600 shadow-[0_0_35px_rgba(255,0,0,0.45)] shadow-inner shadow-red-900 rounded-lg overflow-hidden transition-transform duration-500 hover:scale-105 sticky top-32 border-2 border-red-600 shadow-xl shadow-red-600/20"
                >

                  {/* FRAMER MOTION ANIMATED IMAGE */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={services[activeService].image}
                      src={services[activeService].image}
                      alt={services[activeService].title}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="w-full h-80 object-cover"
                    />
                  </AnimatePresence>

                  <div className="p-6">
                    <h3 className="text-red-500 text-2xl mb-3 font-bold">{services[activeService].title}</h3>
                    <p className="text-gray-300 mb-6">{services[activeService].description}</p>
                    <button
                      onClick={() => {
                        setSelectedService(services[activeService]);
                        setCurrentPage('serviceDetail');
                      }}
                      className="bg-red-600 text-white px-6 py-3 rounded font-semibold hover:bg-red-700 transition"
                    >
                      READ MORE →
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE LIST */}
              <div className="lg:w-3/5 space-y-8">
                {services.map((s, i) => (
                  <div
                    key={s.id}
                    onMouseEnter={() => setActiveService(i)}
                    onClick={() => {
                      setSelectedService(s);
                      setCurrentPage('serviceDetail');
                    }}
                    className="cursor-pointer transition-all duration-300 border-b-2 border-zinc-800 pb-8 hover:border-red-600"
                  >

                    {/* ANIMATED TITLE */}
                    <motion.h3
                      initial={false}
                      animate={{
                        color: i === activeService ? "#dc2626" : "#3f3f46",
                        scale: i === activeService ? 1.05 : 1,
                        x: i === activeService ? 8 : 0,
                      }}
                      transition={{ duration: 0.35 }}
                      className="text-5xl md:text-7xl font-black cursor-pointer"
                    >
                      {s.title}
                    </motion.h3>

                  </div>
                ))}

                <button
                  onClick={() => setCurrentPage('services')}
                  className="text-white flex items-center gap-2 mt-8 hover:text-red-500 transition-colors font-semibold"
                >
                  <span className="text-2xl">+</span> SEE ALL SERVICES
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="bg-[#0d0004] text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-red-600 text-sm tracking-widest mb-4 font-bold">WHO WE ARE</p>
              <h2 className="text-5xl font-black mb-8">About Us</h2>
            </div>

            <div className="max-w-4xl mx-auto text-lg space-y-6 leading-relaxed">
              <p className="text-xl">
                Big Brain Studios is a leading animation company dedicated to creating extraordinary visual experiences.
              </p>
              <p>
                With years of expertise in 3D animation, CGI, and creative campaigns, we transform ideas into captivating stories that resonate with audiences worldwide.
              </p>
              <p>
                Our team of talented artists and technicians work tirelessly to deliver world-class animation services that push the boundaries of creativity and innovation.
              </p>
            </div>

            <div className="flex justify-center mt-12">
              <div className="grid grid-cols-3 gap-12 text-center">
                {[
                  { value: '100+', label: 'Projects' },
                  { value: '50+', label: 'Clients' },
                  { value: '10+', label: 'Years' }
                ].map((stat, idx) => (
                  <div key={idx} style={{ opacity: 1, transform: 'scale(1)' }}>
                    <div className="text-5xl font-black text-red-600 mb-2">{stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="bg-[#0d0004] py-20">
          <ContactSection />
        </section>
      </div>
    );
  };

  // -------------------------
  // CONTACT
  // -------------------------
  const ContactSection = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = () => {
      alert('Message sent!');
      setFormData({ name: '', email: '', message: '' });
    };

    return (
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-red-600 text-sm tracking-widest mb-4 font-bold">GET IN TOUCH</p>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Contact Us</h2>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 w-full">
            <div className="bg-[#0a0a0a] border border-red-600 shadow-[0_0_35px_rgba(255,0,0,0.45)] shadow-inner shadow-red-900 p-8 rounded-lg shadow-2xl border-2 border-red-600">
              <div className="mb-6">
                <label className="block text-white font-bold mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0d0004] border-2 border-zinc-700 rounded focus:outline-none focus:border-red-600 text-white transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="block text-white font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0d0004] border-2 border-zinc-700 rounded focus:outline-none focus:border-red-600 text-white transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="block text-white font-bold mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0d0004] border-2 border-zinc-700 rounded h-32 focus:outline-none focus:border-red-600 text-white transition-colors"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-red-600 text-white py-4 rounded font-bold hover:bg-red-700 transition"
              >
                Send Message
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <h2 className="text-5xl md:text-7xl font-black text-white text-center">
              LET'S<br />
              <span className="text-red-600">TALK</span>
            </h2>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------
  // SERVICES PAGE
  // -------------------------
  const Services = () => (
    <div
      className="bg-[#0d0004] text-white min-h-screen"
      style={{ paddingTop: NAVBAR_HEIGHT }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <p className="text-red-600 text-sm tracking-widest mb-4 font-bold">WHAT WE DO</p>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Our Services</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {services.map((service, idx) => (
            <div
              key={service.id}
              onClick={() => {
                setSelectedService(service);
                setCurrentPage('serviceDetail');
              }}
              className="bg-[#0a0a0a] border border-red-600 shadow-[0_0_35px_rgba(255,0,0,0.45)] shadow-inner shadow-red-900 rounded-lg shadow-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-red-600"
            >
              <img src={service.image} alt={service.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-red-500 text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-12">
          <ContactSection />
        </div>
      </div>
    </div>
  );

  // -------------------------
  // SERVICE DETAIL
  // -------------------------
  const ServiceDetail = () => (
    <div
      className="bg-[#0d0004] text-white min-h-screen"
      style={{ paddingTop: NAVBAR_HEIGHT }}
    >
      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => setCurrentPage('services')}
          className="mb-6 bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
        >
          ← Back to Services
        </button>

        <h1 className="text-4xl md:text-6xl font-black mb-6">{selectedService?.title}</h1>

        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl leading-relaxed">{selectedService?.details}</p>

        <h2 className="text-2xl md:text-4xl font-bold mb-6">Sample Work</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {selectedService?.samples.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Sample ${idx + 1}`}
              className="w-full h-64 object-cover rounded-lg shadow-lg border-2 border-red-600"
            />
          ))}
        </div>

        <ContactSection />
      </div>
    </div>
  );

  // -------------------------
  // PROJECTS
  // -------------------------
  const Projects = () => (
    <div
      className="bg-[#0d0004] text-white min-h-screen"
      style={{ paddingTop: NAVBAR_HEIGHT }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <p className="text-red-600 text-sm tracking-widest mb-4 font-bold">OUR PORTFOLIO</p>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Our Projects</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => {
                setSelectedProject(project);
                setCurrentPage('projectDetail');
              }}
              className="bg-[#0a0a0a] border border-red-600 shadow-[0_0_35px_rgba(255,0,0,0.45)] shadow-inner shadow-red-900 rounded-lg shadow-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-red-600"
            >
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-red-500 text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-300">{project.description}</p>
              </div>
            </div>
          ))}
        </div>

        <ContactSection />
      </div>
    </div>
  );

  // -------------------------
  // PROJECT DETAIL
  // -------------------------
  const ProjectDetail = () => (
    <div
      className="bg-[#0d0004] text-white min-h-screen"
      style={{ paddingTop: NAVBAR_HEIGHT }}
    >
      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => setCurrentPage('projects')}
          className="mb-6 bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
        >
          ← Back to Projects
        </button>

        <h1 className="text-4xl md:text-6xl font-black mb-6">{selectedProject?.title}</h1>

        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl leading-relaxed">{selectedProject?.details}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {selectedProject?.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Project ${idx + 1}`}
              className="w-full h-64 object-cover rounded-lg shadow-lg border-2 border-red-600"
            />
          ))}
        </div>

        <h2 className="text-2xl md:text-4xl font-bold mb-6">Demo Video</h2>

        <div className="aspect-video w-full max-w-4xl mx-auto mb-12 rounded-lg overflow-hidden shadow-2xl border-4 border-red-600">
          <iframe className="w-full h-full" src={selectedProject?.video} title="Demo Video" allowFullScreen />
        </div>

        <ContactSection />
      </div>
    </div>
  );

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="min-h-screen bg-[#0d0004]">
      <Navbar />

      {currentPage === 'home' && <Home />}
      {currentPage === 'services' && <Services />}
      {currentPage === 'serviceDetail' && <ServiceDetail />}
      {currentPage === 'projects' && <Projects />}
      {currentPage === 'projectDetail' && <ProjectDetail />}
    </div>
  );
}

export default App;
