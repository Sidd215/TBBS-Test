import { sanityClient, safeImageUrl } from './sanityClient';
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import emailjs from "emailjs-com";
 


// --------------------
// Assets & sample data
// --------------------
const SAMPLE_IMAGES = {
  service1:
    "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800",
  service2:
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800",
  service3:
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
  service4:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  project1: 
    "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800",
  project2:
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800",
  project3:
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
  project4:
    "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800",
  project5:
    "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800",
  project6:
    "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=800",
};

const LOGO_URL = "/images/BBSLogo.png";
// --------------------



// --------------------
// Project Grid (separate, memoized, no blink)
// --------------------
const ProjectGrid = React.memo(function ProjectGrid({
  visibleProjects,
  onProjectClick,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
      {visibleProjects.map((project, idx) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.45,
            delay: idx * 0.05,
            ease: "easeOut",
          }}
          className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-black/80 overflow-hidden backdrop-blur cursor-pointer transition-all duration-300 hover:border-red-500/50"
          onClick={() => onProjectClick(project)}
        >
          <div className="relative h-56 overflow-hidden">
            {(() => {
              const imgSrc = safeImageUrl(project.image, { width: 1600 });
              return imgSrc && (
                <img
                  src={imgSrc}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              );
            })()}
            <div className={`absolute inset-0 bg-gradient-to-t ${project.accent}`} />
            <div className="absolute top-4 left-4 px-3 py-1 text-xs uppercase tracking-[0.4em] bg-black/50 rounded-full">
              {project.tag}
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-2xl font-black">{project.title}</h3>
              <span className="text-sm text-gray-400">{project.duration}</span>
            </div>

            <p className="text-gray-300 line-clamp-2">{project.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Shots: {project.shots}</span>
              <span>Passes: {2 + (idx % 3)}</span>
            </div>

            <div className="flex gap-3">
              {project.images?.slice(0, 3).map((img, imgIdx) => {
                const src = safeImageUrl(img, { width: 500 });
                return src && (
                  <img
                    key={`${project._id}-${imgIdx}`}
                    src={src}
                    alt={`${project.title} frame ${imgIdx + 1}`}
                    className="h-14 w-16 object-cover rounded-xl border border-white/10"
                  />
                );
              })}
            </div>

            <button className="w-full mt-2 px-4 py-3 border border-white/20 rounded-full text-sm font-semibold transition hover:bg-white/10">
              Open case study →
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

// -------------------------
// NAVBAR (hoisted)
// -------------------------
function Navbar({ scrolledPastHero, NAVBAR_HEIGHT, scrollToSection, setCurrentPage }) {
  return (
    <nav
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 hover:scale-105"
      style={{ width: "90%", maxWidth: "1150px", height: NAVBAR_HEIGHT }}
    >
      <div
        className={`
            w-full h-full flex items-center justify-between px-6 
            rounded-3xl border backdrop-blur-2xl transition-all duration-300
            ${
              scrolledPastHero
                ? "bg-white/10 bg-opacity-20 border-white/20"
                : "bg-white/10 bg-opacity-10 border-white/10"
            }
          `}
      >
        <img src={LOGO_URL} alt="Big Brain Studios" className="h-28 w-auto" />

        <div className="flex items-center space-x-8 font-medium">
          <button
            onClick={() => scrollToSection("hero", true)}
            className="transition-all duration-300 hover:text-red-500 hover:scale-110"
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection("about", true)}
            className="transition-all duration-300 hover:text-red-500 hover:scale-110"
          >
            About
          </button>

          <button
            onClick={() => setCurrentPage("services")}
            className="transition-all duration-300 hover:text-red-500 hover:scale-110"
          >
            Services
          </button>

          <button
            onClick={() => setCurrentPage("projects")}
            className="transition-all duration-300 hover:text-red-500 hover:scale-110"
          >
            Projects
          </button>

          <button
            onClick={() => scrollToSection("contact", true)}
            className={`px-5 py-2 rounded-xl transition-all duration-300 bg-red-600 text-white`}
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}

// -------------------------
// CONTACT (hoisted)
// -------------------------
function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE,
        process.env.REACT_APP_EMAILJS_TEMPLATE,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC
      );

      alert("Message sent successfully! 🚀");
      setFormData({ name: "", email: "", message: "" });

    } catch (error) {
      console.error("EmailJS error:", error);
      alert("Something went wrong — please try again.");
    }

    setSubmitting(false);
  };


  return (
    <section aria-labelledby="contact-heading" className="px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-red-500 text-xs tracking-[0.6em] font-semibold mb-3">GET IN TOUCH</p>
          <h2 id="contact-heading" className="heading-font clamp-heading-lg font-black">Contact Us</h2>
          <p className="text-gray-300 body-font mt-3">We typically respond within one business day.</p>
        </div>

        {/* Premium Glass Card */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
            {/* subtle gradients and highlights */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_500px_at_10%_-20%,rgba(239,68,68,0.08),transparent)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_110%_120%,rgba(168,85,247,0.06),transparent)]" />
            <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_30px_rgba(255,255,255,0.08)]" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Copy/CTA */}
              <div className="relative p-8 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
                <div className="max-w-lg">
                  <h3 className="heading-font font-black clamp-heading-xl mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">LET’S</span>{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">TALK</span>
                  </h3>
                  <p className="text-gray-300 body-font mb-8">
                    Tell us about your goals and timelines. We’ll propose a tailored sprint with milestones
                    and a delivery rhythm that fits your pipeline.
                  </p>

                  {/* Keep only two tiles */}
                  <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
                    {[{label:'Avg. response',value:'<24h'},{label:'On-time delivery',value:'97%'}].map((s)=> (
                      <div key={s.label} className="rounded-2xl bg-white/6 border border-white/10 p-4">
                        <div className="text-xs tracking-[0.3em] uppercase text-gray-400">{s.label}</div>
                        <div className="heading-font text-2xl font-black mt-1">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => document.getElementById('contact-form')?.scrollIntoView({behavior:'smooth',block:'start'})} className="px-6 py-3 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 font-semibold shadow-[0_10px_30px_rgba(239,68,68,0.25)] hover:brightness-110 transition">
                      Start your brief →
                    </button>
                    <a href="mailto:hello@bigbrainstudios.com" className="px-6 py-3 rounded-full border border-white/15 hover:bg-white/10 transition text-gray-200">
                      Email us
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <form id="contact-form" onSubmit={handleSubmit} className="relative p-8 sm:p-10 lg:p-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="body-font text-sm text-gray-300 mb-2 block">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-400/60 transition"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="body-font text-sm text-gray-300 mb-2 block">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-400/60 transition"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="body-font text-sm text-gray-300 mb-2 block">Message</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-400/60 transition resize-none"
                    placeholder="Tell us about your project, goals, budget, and timeline"
                  />
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="text-xs text-gray-400 body-font">By sending, you agree to our terms and privacy policy.</p>
                  <button type="submit" disabled={submitting} className="inline-flex items-center justify-center whitespace-nowrap px-8 md:px-10 py-3 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 font-semibold text-white hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-[0_10px_30px_rgba(239,68,68,0.25)]">
                    {submitting ? 'Sending…' : 'Send message'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Glow accents */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="pointer-events-none absolute -inset-x-10 -bottom-10 h-24 bg-gradient-to-t from-red-600/20 via-pink-500/10 to-transparent blur-2xl"
          />
        </div>
      </div>
    </section>
  );
}

// -------------------------
// HOME (hoisted)
// -------------------------
function Home({ NAVBAR_HEIGHT, scrollToSection, setSelectedService, setCurrentPage, services }) {

  if (!services || !services.length) {
  return <div className="text-center text-white py-20">Loading services…</div>;
}

  const [activeService, setActiveService] = useState(0);

  return (
    <div className="bg-transparent text-white min-h-screen">
      {/* Hero */}
      <section id="hero" className="relative h-screen w-full overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover">
            <source
            src="https://res.cloudinary.com/detqqu26o/video/upload/v1765120213/HomeVideo_nqw6nk.mp4"
            type="video/mp4"
  />
        </video>

        <div className="absolute top-0 left-0 w-full h-full bg-black/30" />

        <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
          <div>
            <h1 className="text-6xl md:text-8xl font-black">
              Welcome to {" "}
              <span className="text-red-600">Big Brain Studios</span>
            </h1>

            <p className="text-2xl mt-6 font-light">Your Premier Animation Partner</p>

            <div className="h-1 w-32 bg-red-600 mx-auto my-8" />

            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
              We bring imagination to life thr  ough cutting-edge animation,
              CGI, and creative campaigns.
            </p>

            <div className="mt-10">
              <button
                onClick={() => scrollToSection("services-section", true)}
                className="bg-red-600 px-8 py-3 rounded text-lg font-bold hover:bg-red-700 transition"
              >
                Explore Our Work
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services interactive (revamped) */}
      <section id="services-section" className="pt-24 pb-24 px-4 bg-transparent" style={{ paddingTop: NAVBAR_HEIGHT + 24 }}>
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <p className="text-red-600 text-xs tracking-[0.6em] font-semibold mb-4">OUR EXPERTISE</p>
            <h2 className="heading-font clamp-heading-lg font-black text-white max-w-3xl mx-auto">
              Built-for-speed creative pods for animation, CGI, and campaigns
            </h2>
            <p className="text-gray-300 body-font mt-3 max-w-2xl mx-auto">
              Hover to preview. Click to deep-dive the service with process and samples.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto items-start">
            {/* LEFT PREVIEW (old format, enhanced visuals) */}
            <div className="lg:w-2/5">
              <div className="relative sticky top-32 rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={services[activeService].image}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative h-80 md:h-96"
                  >
                  {safeImageUrl(services[activeService]?.image, { width: 1200, quality: 80 }) && (
                    <img
                      src={safeImageUrl(services[activeService].image, { width: 1200, quality: 80 })}
                      alt={services[activeService].title}
                    />
                  )}

                    {/* Gradient overlay and inner highlight border */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/10" />
                    {/* Top-left badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.35em] uppercase rounded-full bg-black/50 border border-white/10">
                      Preview
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="p-6 md:p-7">
                  <h3 className="heading-font text-2xl font-black text-white mb-2">
                    {services[activeService].title}
                  </h3>
                  <p className="text-gray-300 body-font mb-6">
                    {services[activeService].description}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedService(services[activeService]);
                      setCurrentPage("serviceDetail");
                    }}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 font-semibold hover:brightness-110 transition shadow-[0_10px_30px_rgba(239,68,68,0.25)]"
                  >
                    READ MORE →
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE LIST (refined, no borders) */}
            <div className="lg:w-3/5 space-y-5">
              {services.map((s, i) => (
                <div
                  key={s._id}
                  onMouseEnter={() => setActiveService(i)}
                  onClick={() => {
                    setSelectedService(s);
                    setCurrentPage("serviceDetail");
                  }}
                  className="group cursor-pointer rounded-xl px-2 py-4 md:py-5 transition-colors duration-300 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-3">
                    <span className={`${i === activeService ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]' : 'bg-white/20'} h-2 w-2 rounded-full transition-all`} />
                    <motion.h3
                      initial={false}
                      animate={{
                        color: i === activeService ? "#ffffff" : "#a1a1aa",
                        x: i === activeService ? 4 : 0,
                        scale: i === activeService ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.25 }}
                      className="heading-font text-6xl md:text-7xl font-black"
                    >
                      {s.title}
                    </motion.h3>
                  </div>
                  {/* Fine fading red line below content */}
                  <div
                    className={`mt-2 h-px bg-gradient-to-r from-red-600/80 via-red-500/40 to-transparent transition-opacity duration-300 ${
                      i === activeService ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'
                    }`}
                  />
                </div>
              ))}

              <button
                onClick={() => setCurrentPage("services")}
                className="text-white flex items-center gap-2 mt-4 hover:text-red-500 transition-colors font-semibold"
              >
                <span className="text-2xl">+</span> SEE ALL SERVICES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-transparent text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-red-600 text-sm tracking-widest mb-4 font-bold">WHO WE ARE</p>
            <h2 className="text-5xl font-black mb-8">About Us</h2>
          </div>

          <div className="max-w-4xl mx-auto text-lg space-y-6 leading-relaxed">
            <p className="text-xl">
              Big Brain Studios is a leading animation company dedicated to
              creating extraordinary visual experiences.
            </p>
            <p>
              With years of expertise in 3D animation, CGI, and creative
              campaigns, we transform ideas into captivating stories that
              resonate with audiences worldwide.
            </p>
            <p>
              Our team of talented artists and technicians work tirelessly to
              deliver world-class animation services that push the boundaries
              of creativity and innovation.
            </p>
          </div>

          <div className="flex justify-center mt-12">
            <div className="grid grid-cols-3 gap-12 text-center">
              {[
                { value: "100+", label: "Projects" },
                { value: "50+", label: "Clients" },
                { value: "10+", label: "Years" },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="text-5xl font-black text-red-600 mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-transparent py-20">
        <ContactSection />
      </section>
    </div>
  );
}

// -------------------------
// SERVICES PAGE (hoisted)
// -------------------------
function Services({ NAVBAR_HEIGHT, setSelectedService, setCurrentPage, scrollToSection, services }) {


  if (!services || !services.length) {
  return <div className="text-center text-white py-20">Loading services…</div>;
}

  const [highlightedService, setHighlightedService] = useState(services[0]);

  const capabilityPills = [
    "Concept Development",
    "Realtime Rendering",
    "Global Team",
    "Story Boarding",
    "Brand Strategy",
  ];

  return (
    <div className="bg-transparent text-white min-h-screen relative overflow-hidden" style={{ paddingTop: NAVBAR_HEIGHT }}>
      
      <div className="container mx-auto px-4 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <p className="text-red-500 text-sm tracking-[0.4em] mb-5 font-semibold">WHAT WE DO</p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Full-stack creative production with cinematic polish.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {capabilityPills.map((pill) => (
            <span key={pill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm tracking-wide backdrop-blur">
              {pill}
            </span>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_minmax(0,0.9fr)] gap-12 items-stretch mb-20">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-3xl sm:text-4xl font-black text-white">Capabilities</h2>
                <span className="text-sm uppercase tracking-[0.4em] text-gray-400">Studio Flow</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {services.map((service, idx) => (
                  <button
                    key={service._id}
                    onClick={() => {
                      setSelectedService(service);
                      setCurrentPage("serviceDetail");
                    }}
                    onMouseEnter={() => setHighlightedService(service)}
                    onFocus={() => setHighlightedService(service)}
                    className={`text-left rounded-2xl border px-5 py-6 transition-all duration-300 ${
                      highlightedService._id === service._id
                        ? "bg-red-600/30 border-red-500/70 shadow-[0_10px_40px_rgba(220,38,38,0.35)]"
                        : "bg-[#09090b]/60 border-white/10 hover:border-red-500/50"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.5em] text-gray-400 mb-3">0{idx + 1}</p>
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-300 text-sm">{service.description}</p>
                    <div className="mt-5 inline-flex items-center text-sm font-semibold text-red-300">Dive deeper →</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={highlightedService._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="h-full bg-gradient-to-br from-red-600/20 via-white/5 to-black/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur"
              >
                <div className="relative h-72">
                  {(() => {
                    const src = safeImageUrl(highlightedService.image, { width: 1400 });
                    return src && (
                      <img
                        src={src}
                        alt={highlightedService.title}
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-xs uppercase tracking-[0.6em] text-red-200 mb-2">featured</p>
                    <h3 className="text-3xl font-black">{highlightedService.title}</h3>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <p className="text-gray-200 text-lg">{highlightedService.details}</p>

                  <div className="flex flex-wrap gap-3">
                    {highlightedService.samples.slice(0, 3).map((sample, idx) => {
                      const src = safeImageUrl(sample, { width: 500 });
                      return src && (
                        <img
                          key={`${highlightedService._id}-${idx}`}
                          src={src}
                          alt={`${highlightedService.title} sample ${idx + 1}`}
                          className="h-20 w-24 object-cover rounded-xl border border-white/10"
                        />
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedService(highlightedService);
                      setCurrentPage("serviceDetail");
                    }}
                    className="mt-4 inline-flex items-center gap-3 px-5 py-3 bg-red-600 hover:bg-red-500 rounded-full text-sm font-semibold transition-colors"
                  >
                    Schedule a sprint →
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur"
          >
            <h3 className="text-2xl font-black mb-4">Production flow</h3>
            <p className="text-gray-300 mb-6">
              From concept to delivery, our pipeline keeps creative momentum
              while maintaining studio-level quality gates.
            </p>
            <div className="space-y-6 md:space-y-8 max-w-xl">
              {[
                {
                  title: "CONCEPT & PRE-VISUALIZATION",
                  bullets: "• aligning brand strategy • storyboarding • styleframes"
                },
                {
                  title: "3D ASSET & WORLD BUILDING",
                  bullets: "• high-fidelity modeling • texturing • camera blocking"
                },
                {
                  title: "ANIMATION & CINEMATOGRAPHY",
                  bullets: "• motion design • lighting setup • fluid simulation"
                },
                {
                  title: "RENDERING & POST-PRODUCTION",
                  bullets: "• 4K rendering • compositing • color grading • final delivery"
                }
              ].map((step, idx) => (
                <div key={step.title} className="
                  text-left rounded-2xl border px-5 py-6 bg-[#09090b]/60 border-white/10
                  transition-all duration-300 hover:bg-white/[0.04]
                  hover:border-red-500/50
                ">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-white/[0.3] to-white/[0.08] backdrop-blur-xl border border-white/[0.3] shadow-[0_4px_18px_rgba(255,255,255,0.15)] font-black text-xl text-white">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <h4
                        className="font-black text-white mb-0.01"
                        style={{ fontSize: "1.3rem" }}
                      >
                        {step.title}
                      </h4>
                      <p className="text-gray-200 text-sm leading-relaxed">{step.bullets}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="bg-gradient-to-br from-[#0f0f12] via-[#1b0b11] to-[#35060f] border border-white/10 rounded-3xl p-8"
          >
            <h3 className="text-2xl font-black mb-4">Results at a glance</h3>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { label: "Avg. delivery", value: "10 Days" },
                { label: "Client retention", value: "92%" },
                { label: "Shot capacity", value: "120+/Q" },
                { label: "Review cycles", value: "<3" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-black mt-2">{stat.value}</p>
                </div>
              ))}
            </div>

            <p className="text-gray-300 mb-4">
              Plug into our pipeline as an embedded partner or use us as an
              elite strike team for hero moments.
            </p>

            <button
              onClick={() => scrollToSection("contact", true)}
              className="inline-flex items-center gap-3 px-6 py-3 border border-white/20 rounded-full hover:bg-white/10 transition"
            >
              Open brief template →
            </button>
          </motion.div>
        </div>

        <ContactSection />
      </div>
    </div>
  );
}

// -------------------------
// SERVICE DETAIL (hoisted)
// -------------------------
function ServiceDetail({ NAVBAR_HEIGHT, selectedService, setCurrentPage }) {
  return (
    <div className="bg-transparent text-white min-h-screen" style={{ paddingTop: NAVBAR_HEIGHT }}>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={() => setCurrentPage("services")}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/15 rounded-full text-gray-200 hover:bg-white/20 transition backdrop-blur"
          >
            <span>←</span> Back to Services
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Left: Hero Image & Title */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
              <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_10%_-20%,rgba(239,68,68,0.08),transparent)]" />

              <div className="relative h-80 md:h-96">
                {(() => {
                  const src = safeImageUrl(selectedService?.image, { width: 1400 });
                  return src && (
                    <img
                      src={src}
                      alt={selectedService?.title}
                      className="w-full h-full object-cover"
                    />
                  );
                })()}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute top-6 left-6 px-4 py-2 text-xs uppercase tracking-[0.4em] bg-black/50 rounded-full border border-white/10">
                  Service Detail
                </div>
              </div>

              <div className="p-8">
                <h1 className="text-4xl md:text-5xl font-black mb-4">{selectedService?.title}</h1>
                <p className="text-gray-300 text-lg leading-relaxed">{selectedService?.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur">
              <h2 className="text-2xl font-black mb-4">About This Service</h2>
              <p className="text-gray-300 leading-relaxed">{selectedService?.details}</p>
            </div>

            <div className="bg-gradient-to-br from-red-600/20 via-white/5 to-black/40 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-black mb-4">Why Choose Us?</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🎨", text: "Creative Excellence" },
                  { icon: "⚡", text: "Fast Delivery" },
                  { icon: "🏆", text: "Award-Winning Work" },
                  { icon: "🤝", text: "Dedicated Support" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-200">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({behavior:'smooth'})}
              className="w-full px-8 py-4 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-full font-semibold text-white hover:brightness-110 transition shadow-[0_10px_30px_rgba(239,68,68,0.25)]"
            >
              Get Started →
            </motion.button>
          </motion.div>
        </div>

        {/* Sample Work */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <p className="text-red-500 text-xs tracking-[0.6em] font-semibold mb-3">SAMPLE WORK</p>
            <h2 className="text-4xl md:text-5xl font-black">See Our Craft in Action</h2>
            <p className="text-gray-300 text-lg mt-3 max-w-2xl mx-auto">
              Explore our portfolio of {selectedService?.title.toLowerCase()} projects that showcase our expertise and creativity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {selectedService?.samples?.map((img, idx) => {
              const src = safeImageUrl(img, { width: 900 });
              if (!src) return null;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group relative rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur shadow-[0_10px_40px_rgba(0,0,0,0.45)] hover:border-red-500/50 transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={src}
                      alt={`Sample ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-sm font-semibold">View Full Size</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <ContactSection />
      </div>
    </div>
  );
}

// -------------------------
// PROJECTS PAGE (hoisted)
// -------------------------
function Projects({ NAVBAR_HEIGHT, setSelectedProject, setCurrentPage, scrollToSection, projects }) {

  const filterOptions = ["All", "Cinematic", "CGI", "Campaigns", "Experiential", "Realtime"];
  const accentGradients = [
    "from-red-600/40 via-pink-600/20 to-transparent",
    "from-orange-500/40 via-amber-500/20 to-transparent",
    "from-fuchsia-500/40 via-purple-500/20 to-transparent",
    "from-sky-500/40 via-cyan-500/20 to-transparent",
  ];

  const taggedProjects = useMemo(
    () =>
      projects.map((project, idx) => ({
        ...project,
        tag: filterOptions[(idx % (filterOptions.length - 1)) + 1],
        accent: accentGradients[idx % accentGradients.length],
        shots: 18 + idx * 3,
        duration: `${45 + idx * 5}s`,
      })),
    [projects]
  );

  const [activeFilter, setActiveFilter] = useState("All");
  const [heroIndex, setHeroIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0); // 1 = forward, -1 = back

  const visibleProjects = useMemo(
    () => (activeFilter === "All" ? taggedProjects : taggedProjects.filter((p) => p.tag === activeFilter)),
    [activeFilter, taggedProjects]
  );

  const wrappedVisibleProjects = visibleProjects.length > 0 ? visibleProjects : taggedProjects;
  const heroProject = wrappedVisibleProjects[heroIndex % wrappedVisibleProjects.length];

  // Auto-rotate hero
  useEffect(() => {
    if (isPaused || wrappedVisibleProjects.length <= 1) return;

    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % wrappedVisibleProjects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, wrappedVisibleProjects.length]);

  useEffect(() => {
    if (heroIndex !== 0) {
      setHeroIndex(0);
    }
  }, [activeFilter]);

  const goto = (index, dir = 0) => {
    const safe = Math.max(0, Math.min(index, wrappedVisibleProjects.length - 1));
    setDirection(dir);
    setHeroIndex(safe);
  };

  const prev = () => goto((heroIndex - 1 + wrappedVisibleProjects.length) % wrappedVisibleProjects.length, -1);
  const next = () => goto((heroIndex + 1) % wrappedVisibleProjects.length, 1);

  return (
    <div className="bg-transparent text-white min-h-screen" style={{ paddingTop: NAVBAR_HEIGHT }}>
      <div className="container mx-auto px-4 py-16 space-y-12">
        {/* Top heading (no whileInView so it shows immediately) */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-center max-w-4xl mx-auto space-y-4">
          <p className="text-red-500 text-xs tracking-[0.6em] font-semibold">PORTFOLIO LAB</p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight">
            Immersive storytelling built for campaigns, films, and realtime
            experiences.
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Browse the hero carousel — minimal, refined, and focused on the imagery. Click &quot;View hero case&quot; to open the full project details.
          </p>
        </motion.div>

        {/* LEFT-ONLY HERO */}
        <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="relative" aria-roledescription="carousel">
          <AnimatePresence mode="wait">
            {heroProject && (
              <motion.div
                key={heroProject._id}
                custom={direction}
                variants={{
                  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80, filter: "blur(10px)" }),
                  center: { opacity: 1, x: 0, filter: "blur(0px)" },
                  exit: (dir) => ({ opacity: 0, x: dir < 0 ? 80 : -80, filter: "blur(10px)" }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.65,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  opacity: { duration: 0.65 },
                  x: { duration: 0.65 },
                  filter: { duration: 0.65 },
                }}
                className="rounded-3xl overflow-hidden border-2 border-white/10 bg-gradient-to-b from-white/8 to-white/4 shadow-2xl backdrop-blur-xl"
              >
                {/* Glass background layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-white/2 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/3 via-transparent to-purple-500/3 pointer-events-none" />

                {/* Inset glow border */}
                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_30px_rgba(255,255,255,0.08)] pointer-events-none" />

                <div className="relative h-[26rem] md:h-[34rem] lg:h-[40rem] overflow-hidden">
                  {(() => {
                    const src = safeImageUrl(heroProject.image, { width: 1800 });
                    return src && (
                      <motion.img
                        src={src}
                        alt={heroProject.title}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.14}
                        onDragStart={() => setIsPaused(true)}
                        onDragEnd={(_, info) => {
                          const threshold = 80;
                          if (info.offset.x < -threshold) next();
                          else if (info.offset.x > threshold) prev();
                          setTimeout(() => setIsPaused(false), 250);
                        }}
                        whileTap={{ scale: 0.995 }}
                        className="w-full h-full object-cover cursor-grab active:cursor-grabbing touch-pan-x"
                        style={{ userSelect: "none", WebkitUserDrag: "none" }}
                      />
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <motion.span
                    aria-hidden
                    initial={{ x: "-20%" }}
                    animate={{ x: isPaused ? "-10%" : "40%" }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
                    className="absolute -right-40 -top-32 w-80 h-80 bg-gradient-to-r from-red-500/16 to-transparent rounded-full blur-3xl pointer-events-none"
                  />
                  <div className="absolute left-6 bottom-6 right-6 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-widest text-red-300 font-semibold mb-1">{heroProject.tag}</div>
                      <h2 className="text-3xl md:text-4xl font-black mb-1">{heroProject.title}</h2>
                      <p className="text-gray-300 max-w-2xl line-clamp-2">{heroProject.description}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                      <motion.button
                        whileHover={{ scale: 1.03, boxShadow: "0 12px 40px rgba(239,68,68,0.18)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedProject(heroProject);
                          setCurrentPage("projectDetail");
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-full font-semibold hover:brightness-105 transition shadow-lg"
                      >
                        View hero case →
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.open(heroProject.video, "_blank")}
                        className="px-4 py-2 border border-white/10 rounded-lg text-sm text-gray-200 hover:bg-white/4 transition"
                      >
                        Watch demo
                      </motion.button>
                    </div>
                  </div>

                  {/* controls */}
                  <div className="absolute right-6 top-6 flex items-center gap-3">
                    <motion.button onClick={prev} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="flex items-center justify-center w-11 h-11 rounded-full bg-black/30 border border-white/8 shadow-lg backdrop-blur-md" aria-label="Previous">
                      <span className="text-xl text-white/90">‹</span>
                    </motion.button>
                    <motion.button onClick={next} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-red-700 via-red-600 to-red-500 border border-red-400 shadow-[0_12px_30px_rgba(239,68,68,0.18)]" aria-label="Next">
                      <span className="text-xl text-white font-bold">›</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => {
                setActiveFilter(option);
              }}
              className={`px-4 py-2 rounded-full text-sm uppercase tracking-widest transition ${
                activeFilter === option
                  ? "bg-red-600 text-white shadow-[0_10px_30px_rgba(220,38,38,0.35)]"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:border-red-500/60"
              }`}
            >
              {option}
            </button>
          ))}
        </motion.div>

        {/* Project grid (uses memoized ProjectGrid, no blink) */}
        <ProjectGrid
          visibleProjects={visibleProjects}
          onProjectClick={(project) => {
            setSelectedProject(project);
            setCurrentPage("projectDetail");
          }}
        />

        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-gray-400 mb-3">COLLAB MODE</p>
            <h3 className="text-3xl font-black mb-3">Need a bespoke drop?</h3>
            <p className="text-gray-300 max-w-2xl">
              We build project pods that plug directly into your pipeline. Share the brief and we&apos;ll spin up concepts, boards, and production schedules within 48 hours.
            </p>
          </div>
          <button onClick={() => scrollToSection("contact", true)} className="px-6 py-3 bg-red-600 rounded-full font-semibold hover:bg-red-500 transition">
            Start a project →
          </button>
        </div>

        <ContactSection />
      </div>
    </div>
  );
}

// -------------------------
// PROJECT DETAIL (hoisted)
// -------------------------
function ProjectDetail({ NAVBAR_HEIGHT, selectedProject, setSelectedProject, setCurrentPage, projects }) {

  const project = selectedProject || (Array.isArray(projects) && projects.length > 0 ? projects[0] : null);
  if (!project || !Array.isArray(projects)) {
    return (
      <div className="text-center text-gray-400 py-20">
        Content unavailable
      </div>
    );
  }

  const idx = Math.max(0, projects.findIndex((p) => p._id === project._id));
  const tagOptions = ["All", "Cinematic", "CGI", "Campaigns", "Experiential", "Realtime"];
  const projectTag = tagOptions[(idx % (tagOptions.length - 1)) + 1];
  const shots = 18 + idx * 3;
  const [direction, setDirection] = useState(0);

  const navigate = (newProject) => {
    const newIdx = projects.findIndex((p) => p._id === newProject._id);
    setDirection(newIdx > idx ? 1 : -1);
    setSelectedProject(newProject);
  };

  return (
    <div className="bg-transparent text-white min-h-screen" style={{ paddingTop: NAVBAR_HEIGHT }}>
      <div className="container mx-auto px-4 py-12">
        <button onClick={() => setCurrentPage("projects")} className="mb-8 px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-500 transition">
          ← Back to Projects
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
          {/* LEFT: hero, description, images, video */}
          <div>
            <AnimatePresence mode="wait">
              {project && (
                <motion.div
                  key={project._id}
                  custom={direction}
                  variants={{
                    enter: (dir) => ({
                      x: dir > 0 ? 300 : -300,
                      y: dir > 0 ? -100 : 100,
                      opacity: 0,
                      scale: 0.85,
                      rotateY: dir > 0 ? -25 : 25,
                      rotateZ: dir > 0 ? 3 : -3,
                      filter: "blur(20px)",
                    }),
                    center: {
                      x: 0,
                      y: 0,
                      opacity: 1,
                      scale: 1,
                      rotateY: 0,
                      rotateZ: 0,
                      filter: "blur(0px)",
                    },
                    exit: (dir) => ({
                      x: dir < 0 ? 300 : -300,
                      y: dir < 0 ? -100 : 100,
                      opacity: 0,
                      scale: 0.85,
                      rotateY: dir < 0 ? -25 : 25,
                      rotateZ: dir < 0 ? 3 : -3,
                      filter: "blur(20px)",
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.75,
                    ease: [0.34, 1.56, 0.64, 1],
                    scale: { duration: 0.75 },
                    opacity: { duration: 0.75 },
                  }}
                  style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                  className="relative mb-12"
                >
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                    <div className="absolute inset-0 rounded-3xl border border-white/10 shadow-[inset_0_0_30px_rgba(255,255,255,0.05)] pointer-events-none" />

                    <div className="relative h-96 md:h-[28rem] lg:h-96 overflow-hidden">
                      {(() => {
                        const src = safeImageUrl(project.image, { width: 1800 });
                        return src && (
                          <motion.img
                            src={src}
                            alt={project.title}
                            initial={{ scale: 1.15, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full h-full object-cover"
                          />
                        );
                      })()}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
                      <motion.div
                        initial={{ x: "-40%", opacity: 0 }}
                        animate={{ x: "100%", opacity: 0.12 }}
                        transition={{ duration: 8, ease: "linear" }}
                        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-red-400/30 to-transparent rounded-full blur-3xl pointer-events-none"
                      />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-3">
                        <div className="inline-flex items-center gap-2 w-fit">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <span className="text-xs uppercase tracking-widest text-red-300 font-semibold mb-1">{projectTag}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black leading-tight">{project.title}</h1>
                        <p className="text-gray-200 max-w-2xl line-clamp-2 text-lg">{project.description}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">{project.details}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {project.images.map((img, imgIdx) => {
                const src = safeImageUrl(img, { width: 900 });
                if (!src) return null;
                return (
                  <motion.img
                    key={imgIdx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: imgIdx * 0.1 }}
                    src={src}
                    alt={`Project ${imgIdx + 1}`}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm"
                  />
                );
              })}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
              <h2 className="text-2xl md:text-4xl font-black mb-6">Demo</h2>
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm">
                <iframe className="w-full h-full" src={project.video} title="Demo Video" allowFullScreen />
              </div>
            </motion.div>

            <ContactSection />
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="sticky top-[120px]">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/4 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              <div className="absolute inset-0 rounded-2xl border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] pointer-events-none" />

              <div className="relative p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black">Delivery rhythm</h3>
                  <span className="text-xs uppercase tracking-widest text-gray-400">Sprint stats</span>
                </div>

                <p className="text-gray-300 text-sm">Focused sprints covering look-dev, hero shots, and finishing — tailored per project.</p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Avg. sprint", value: "24 days" },
                    { label: "Shots / drop", value: shots },
                    { label: "Realtime scenes", value: "6+" },
                    { label: "Live toolkit", value: "UE + Houdini" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="rounded-xl bg-white/6 border border-white/8 p-3 backdrop-blur-sm hover:bg-white/8 transition"
                    >
                      <p className="text-xs uppercase text-gray-400">{stat.label}</p>
                      <div className="text-xl font-black mt-1">{stat.value}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-4">
                  {["Narrative development", "Realtime previz", "Hero shot polish"].map((label, i) => {
                    const pct = 30 + i * 15;
                    return (
                      <motion.div key={label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                          <span>{label}</span>
                          <span className="font-semibold text-red-400">{pct}%</span>
                        </div>
                        <div className="h-2 bg-white/6 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                          <motion.div
                            initial={{ width: "0%" }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                            className="h-full bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-semibold">Featured projects</div>
                  <div className="grid grid-cols-1 gap-2">
                    {projects.slice(0, 6).map((p) => (
                      <motion.button
                        key={p._id}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(p)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition backdrop-blur-sm border ${
                          p._id === project._id
                            ? "bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white border-red-400 shadow-[0_8px_20px_rgba(239,68,68,0.2)]"
                            : "bg-white/6 text-gray-300 hover:bg-white/8 border-white/10"
                        }`}
                      >
                        {p.title}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span className="font-semibold">Project</span>
                    <span className="text-red-400 font-semibold">{idx + 1}/{projects.length}</span>
                  </div>
                  <div className="h-2 bg-white/6 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min(100, (shots / 36) * 100)}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-red-500 to-pink-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// -------------------------
// Cinematic background component (brand-consistent, purpose-driven)
// -------------------------
function CinematicBackground() {
  // Bokeh Light Orbs variant (brand-consistent reds/magentas)
  const orbs = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    size: 240 + (i % 6) * 110, // 240–800px
    x: (i * 83) % 100,
    y: (i * 47) % 100,
    hue: [
      'rgba(255,58,58,0.16)',
      'rgba(255,77,109,0.14)',
      'rgba(217,39,98,0.12)'
    ][i % 3],
    delay: (i % 7) * 1.5,
    dur: 18 + (i % 5) * 6,
  }));

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-black">
      {/* Base tinted gradient */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #000000 80%, #8b0000 100%)' }} />

      {/* Bokeh orbs */}
      {orbs.map((o) => (
        <motion.div
          key={o._id}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${o.x}%`,
            top: `${o.y}%`,
            width: o.size,
            height: o.size,
            background: `radial-gradient(circle at 30% 30%, ${o.hue}, rgba(0,0,0,0) 65%)`,
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'screen',
          }}
          initial={{ opacity: 0.08, scale: 0.98 }}
          animate={{
            opacity: [0.08, 0.16, 0.1],
            scale: [0.98, 1.05, 1.0],
            x: [0, 12, -8, 0],
            y: [0, -10, 8, 0],
          }}
          transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut', delay: o.delay }}
        />
      ))}

      {/* Gentle corner tints for depth */}
      <motion.div
        className="absolute -left-40 -top-20 w-[800px] h-[800px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle at center, rgba(255,40,60,0.18), rgba(0,0,0,0) 70%)' }}
        animate={{ opacity: [0.12, 0.2, 0.14], scale: [1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-40 bottom-0 w-[900px] h-[900px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle at center, rgba(255,20,60,0.14), rgba(0,0,0,0) 70%)' }}
        animate={{ opacity: [0.1, 0.18, 0.12], scale: [1.05, 0.95, 1.05] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// -------------------------
// App Component (now only orchestrates state + layout)
// -------------------------
function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  const NAVBAR_HEIGHT = 80;

    const [services, setServices] = useState([]);
    const [projects, setProjects] = useState([]);
  // Scroll logic for navbar transparency / hero

useEffect(() => {
  sanityClient.fetch(
    `*[_type == "service"]{
      _id,
      title,
      description,
      details,
      image,
      samples
    }`
  ).then(setServices);
}, []);


useEffect(() => {
  sanityClient.fetch(
    `*[_type == "project"]{
      _id,
      title,
      description,
      details,
      image,
      images,
      video
    }`
  ).then(setProjects);
}, []);


  useEffect(() => {
    if (currentPage !== "home") {
      setScrolledPastHero(true);
      return;
    }

    const update = () => {
      const heroEl = document.getElementById("hero");
      const heroHeight = heroEl?.getBoundingClientRect().height || 0;

      const shouldBeScrolled = window.scrollY > Math.max(50, heroHeight - NAVBAR_HEIGHT - 20);

      setScrolledPastHero((prev) => (prev !== shouldBeScrolled ? shouldBeScrolled : prev));
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

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [currentPage]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentPage]);

  const scrollToSection = (id, ensureHome = false) => {
    if (ensureHome) {
      setCurrentPage("home");
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          const y = window.scrollY + el.getBoundingClientRect().top - NAVBAR_HEIGHT + 8;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;
    const y = window.scrollY + el.getBoundingClientRect().top - NAVBAR_HEIGHT + 8;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // -------------------------
  // Render helpers
  // -------------------------
  const renderPage = () => {
    switch (currentPage) {
      case "services":
        return (
          <Services
            NAVBAR_HEIGHT={NAVBAR_HEIGHT}
            setSelectedService={setSelectedService}
            setCurrentPage={setCurrentPage}
            scrollToSection={scrollToSection}
            services={services}
          />
        );
      case "serviceDetail":
        return (
          <ServiceDetail
            NAVBAR_HEIGHT={NAVBAR_HEIGHT}
            selectedService={selectedService}
            setCurrentPage={setCurrentPage}
          />
        );
      case "projects":
        return (
          <Projects
            NAVBAR_HEIGHT={NAVBAR_HEIGHT}
            setSelectedProject={setSelectedProject}
            setCurrentPage={setCurrentPage}
            scrollToSection={scrollToSection}
            projects={projects} 
          />
        );
      case "projectDetail":
        return (
          <ProjectDetail
            NAVBAR_HEIGHT={NAVBAR_HEIGHT}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            setCurrentPage={setCurrentPage}
            projects={projects} 
          />
        );
      default:
        return (
          <Home
            NAVBAR_HEIGHT={NAVBAR_HEIGHT}
            scrollToSection={scrollToSection}
            setSelectedService={setSelectedService}
            setCurrentPage={setCurrentPage}
            services={services}

          />
        );
    }
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <CinematicBackground />

      <Navbar
        scrolledPastHero={scrolledPastHero}
        NAVBAR_HEIGHT={NAVBAR_HEIGHT}
        scrollToSection={scrollToSection}
        setCurrentPage={setCurrentPage}
      />

      <div className="relative z-10">{renderPage()}</div>
    </div>
  );
}

export default App;
