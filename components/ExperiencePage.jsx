"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  Camera,
  Check,
  Clock,
  GlassWater,
  Leaf,
  Menu,
  MessageCircle,
  Pause,
  Play,
  Ship,
  Sun,
  Umbrella,
  Utensils,
  Users,
  Waves,
  Wine,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { translations } from "@/data/translations";

export const WHATSAPP_NUMBER = "905442701157";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const navigationKeys = [
  "experience",
  "route",
  "included",
  "gallery",
  "before",
  "contact",
];

const includedIcons = {
  utensils: Utensils,
  glass: GlassWater,
  wine: Wine,
  leaf: Leaf,
  waves: Waves,
  sun: Sun,
  umbrella: Umbrella,
  crew: Users,
};

const gallerySources = [
  "/images/cove-boat.webp",
  "/images/turunc-bay.webp",
  "/images/marmaris-harbour.webp",
  "/images/boat-deck.webp",
  "/images/crystal-bay.webp",
  "/images/sea-jump.webp",
];

const routeSources = [
  "/images/marmaris-harbour.webp",
  "/images/crystal-bay.webp",
  "/images/cove-boat.webp",
  "/images/turunc-bay.webp",
  "/images/turunc-bay.webp",
  "/images/crystal-bay.webp",
  "/images/marmaris-harbour.webp",
];

const reveal = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
  },
};

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduceMotion ? undefined : reveal}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

function MagneticLink({ href, children, className = "", ariaLabel }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 24 });
  const springY = useSpring(y, { stiffness: 280, damping: 24 });

  const handleMove = (event) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.14);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.14);
  };

  return (
    <motion.a
      href={href}
      className={className}
      aria-label={ariaLabel}
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={reduceMotion ? undefined : { scale: 1.025 }}
      whileTap={{ scale: 0.98 }}
      target={href.startsWith("https://") ? "_blank" : undefined}
      rel={href.startsWith("https://") ? "noreferrer" : undefined}
    >
      {children}
    </motion.a>
  );
}

function Header({ language, setLanguage, t }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 72);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <a className="brand-lockup" href="#top" aria-label="MAVIMARIS home">
        <span className="brand-name">MAVIMARIS</span>
        <span className="brand-subtitle">Marmaris Boat Experience</span>
      </a>

      <nav className="desktop-nav" aria-label="Main navigation">
        {navigationKeys.map((key) => (
          <a key={key} href={`#${key}`}>
            {t.navigation[key]}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <div
          className="language-toggle"
          role="group"
          aria-label={t.languageLabel}
        >
          {["en", "tr"].map((code) => (
            <button
              key={code}
              type="button"
              className={language === code ? "active" : ""}
              aria-pressed={language === code}
              onClick={() => setLanguage(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? t.menuClose : t.menuOpen}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {navigationKeys.map((key) => (
              <a key={key} href={`#${key}`} onClick={closeMenu}>
                {t.navigation[key]}
              </a>
            ))}
            <a
              className="mobile-nav-whatsapp"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
            >
              <MessageCircle aria-hidden="true" />
              {t.hero.whatsapp}
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ t }) {
  const videoRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [manualPlayback, setManualPlayback] = useState(null);
  const isPlaying = manualPlayback ?? !reduceMotion;

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/cove-boat.webp"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/videos/mavimaris-sea.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-reflection" aria-hidden="true" />

      <motion.div
        className="hero-content container"
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.16 },
          },
        }}
      >
        <motion.h1 id="hero-title" variants={reveal}>
          {t.hero.title}
        </motion.h1>
        <motion.p className="hero-subtitle" variants={reveal}>
          {t.hero.subtitle}
        </motion.p>
        <motion.p className="hero-description" variants={reveal}>
          {Array.isArray(t.hero.description)
            ? t.hero.description.map((line) => (
                <span key={line}>{line}</span>
              ))
            : t.hero.description}
        </motion.p>

        <motion.div className="hero-actions" variants={reveal}>
          <MagneticLink
            href={WHATSAPP_URL}
            className="button button-primary button-shine"
            ariaLabel={t.whatsappLabel}
          >
            <MessageCircle aria-hidden="true" />
            {t.hero.whatsapp}
          </MagneticLink>
          <MagneticLink href="#route" className="button button-ghost">
            {t.hero.explore}
            <ArrowDown aria-hidden="true" />
          </MagneticLink>
        </motion.div>

        <motion.ul className="hero-chips" variants={reveal}>
          {t.hero.chips.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </motion.ul>
      </motion.div>

      <button
        type="button"
        className="video-control"
        onClick={() => setManualPlayback(!isPlaying)}
        aria-label={isPlaying ? t.videoPause : t.videoPlay}
      >
        {isPlaying ? (
          <Pause size={16} aria-hidden="true" />
        ) : (
          <Play size={16} aria-hidden="true" />
        )}
      </button>

      <a className="scroll-indicator" href="#experience">
        <span>{t.hero.scroll}</span>
        <span className="scroll-line" aria-hidden="true" />
      </a>
      <div className="hero-fade" aria-hidden="true" />
    </section>
  );
}

function SectionHeading({ eyebrow, title, intro, centered = false }) {
  return (
    <Reveal className={`section-heading ${centered ? "centered" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={Array.isArray(title) ? "title-lines" : undefined}>
        {Array.isArray(title)
          ? title.map((line) => <span key={line}>{line}</span>)
          : title}
      </h2>
      {intro && <p className="section-intro">{intro}</p>}
    </Reveal>
  );
}

function ExperienceSection({ t }) {
  return (
    <section className="section experience-section" id="experience">
      <div className="ambient-blob blob-one" aria-hidden="true" />
      <div className="container experience-grid">
        <div>
          <SectionHeading
            eyebrow={t.experience.eyebrow}
            title={t.experience.title}
          />
          <Reveal delay={0.1}>
            <p className="experience-copy">{t.experience.text}</p>
          </Reveal>
        </div>

        <Reveal className="experience-card scene-3d" delay={0.12}>
          <div className="experience-card-inner">
            <div className="card-topline">
              <Ship aria-hidden="true" />
              <span>{t.experience.cardTitle}</span>
            </div>
            <dl>
              {t.experience.details.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function RouteSection({ t }) {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end 0.75"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
  });

  return (
    <section className="section route-section" id="route" ref={sectionRef}>
      <div className="container">
        <SectionHeading
          eyebrow={t.route.eyebrow}
          title={t.route.title}
          intro={t.route.intro}
        />

        <div className="route-timeline">
          <div className="timeline-track" aria-hidden="true">
            <motion.div
              className="timeline-progress"
              style={reduceMotion ? { scaleY: 1 } : { scaleY }}
            />
          </div>

          {t.route.stops.map((stop, index) => (
            <motion.article
              className="route-card"
              key={stop.name}
              initial={reduceMotion ? false : { opacity: 0, y: 38 }}
              whileInView={
                reduceMotion ? undefined : { opacity: 1, y: 0 }
              }
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.65,
                delay: Math.min(index * 0.04, 0.2),
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -6, rotateX: 1.5, rotateY: index % 2 ? -1.5 : 1.5 }
              }
            >
              <span className="timeline-dot" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="route-image">
                <Image
                  src={routeSources[index]}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 34vw, 220px"
                />
              </div>
              <div className="route-card-copy">
                <div className="route-duration">
                  <Clock size={15} aria-hidden="true" />
                  {stop.duration}
                </div>
                <h3>{stop.name}</h3>
                <p>{stop.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
        <p className="route-note">{t.route.note}</p>
      </div>
    </section>
  );
}

function IncludedSection({ t }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section included-section" id="included">
      <div className="included-glow glow-left" aria-hidden="true" />
      <div className="included-glow glow-right" aria-hidden="true" />
      <div className="container">
        <SectionHeading
          eyebrow={t.included.eyebrow}
          title={t.included.title}
          centered
        />
        <motion.div
          className="included-grid"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.18 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {t.included.items.map(([iconKey, label]) => {
            const Icon = includedIcons[iconKey];
            return (
              <motion.article
                className="included-card"
                key={label}
                variants={reduceMotion ? undefined : reveal}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -7, rotateX: 3, rotateY: -2 }
                }
              >
                <span className="included-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{label}</h3>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function GalleryCard({ src, alt, caption, index }) {
  const cardRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    index % 2 ? [28, -28] : [-22, 22],
  );

  return (
    <motion.figure
      ref={cardRef}
      className={`gallery-card gallery-card-${index + 1}`}
      style={reduceMotion ? undefined : { y }}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="gallery-media">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 760px) 84vw, (max-width: 1100px) 46vw, 34vw"
        />
      </div>
      <figcaption>{caption}</figcaption>
    </motion.figure>
  );
}

function GallerySection({ t }) {
  return (
    <section className="section gallery-section" id="gallery">
      <div className="gallery-blob gallery-blob-one" aria-hidden="true" />
      <div className="gallery-blob gallery-blob-two" aria-hidden="true" />
      <div className="container">
        <SectionHeading
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          intro={t.gallery.intro}
        />
        <div className="gallery-layout">
          {t.gallery.images.map(([alt, caption], index) => (
            <GalleryCard
              key={caption}
              src={gallerySources[index]}
              alt={alt}
              caption={caption}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeSection({ t }) {
  return (
    <section className="section before-section" id="before">
      <div className="container before-grid">
        <SectionHeading
          eyebrow={t.before.eyebrow}
          title={t.before.title}
          intro={t.before.intro}
        />
        <motion.ul
          className="before-list"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.055 } },
          }}
        >
          {t.before.items.map((item) => (
            <motion.li key={item} variants={reveal}>
              <span>
                <Check size={17} strokeWidth={2.2} aria-hidden="true" />
              </span>
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function FinalCta({ t }) {
  return (
    <section className="final-section" id="contact">
      <div className="container">
        <Reveal className="final-card">
          <Image
            src="/images/cove-boat.webp"
            alt=""
            fill
            sizes="(max-width: 760px) 100vw, 1200px"
          />
          <div className="final-overlay" aria-hidden="true" />
          <div className="final-content">
            <p className="eyebrow">{t.final.eyebrow}</p>
            <h2>{t.final.title}</h2>
            <p>{t.final.text}</p>
            <MagneticLink
              href={WHATSAPP_URL}
              className="button button-light button-shine"
              ariaLabel={t.whatsappLabel}
            >
              <MessageCircle aria-hidden="true" />
              {t.final.button}
            </MagneticLink>
            <span className="final-trust">
              <Check size={15} aria-hidden="true" />
              {t.final.trust}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="brand-name">MAVIMARIS</span>
          <span>{t.footer.identity}</span>
          <span>{t.footer.location}</span>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          {navigationKeys.map((key) => (
            <a key={key} href={`#${key}`}>
              {t.navigation[key]}
            </a>
          ))}
        </nav>

        <div className="footer-contact">
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden="true" />
            {t.footer.whatsapp}
          </a>
          <span>
            <Camera aria-hidden="true" />
            {t.footer.instagram}
          </span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} MAVIMARIS. {t.footer.rights}
        </span>
        <span>36.85° N · 28.27° E</span>
      </div>
    </footer>
  );
}

export default function ExperiencePage() {
  const [language, setLanguage] = useState("en");
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <Header language={language} setLanguage={setLanguage} t={t} />
      <main id="main" tabIndex={-1}>
        <Hero t={t} />
        <ExperienceSection t={t} />
        <RouteSection t={t} />
        <IncludedSection t={t} />
        <GallerySection t={t} />
        <BeforeSection t={t} />
        <FinalCta t={t} />
      </main>
      <Footer t={t} />
      <motion.a
        className="floating-whatsapp"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label={t.whatsappLabel}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
      >
        <MessageCircle aria-hidden="true" />
        <span>WhatsApp</span>
      </motion.a>
    </>
  );
}
