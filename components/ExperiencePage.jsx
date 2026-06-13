"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  Check,
  ChevronDown,
  Clock,
  GlassWater,
  Leaf,
  Menu,
  MessageCircle,
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

export const WHATSAPP_NUMBER = "905356187131";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const navigationKeys = [
  "experience",
  "route",
  "included",
  "gallery",
  "before",
  "contact",
];

const languageCodes = ["en", "ru", "it", "tr"];

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
      initial={false}
      whileInView={
        reduceMotion
          ? undefined
          : { opacity: [0.55, 1], y: [18, 0] }
      }
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.68,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
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
  const [languageOpen, setLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const languageRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  const selectLanguage = (code) => {
    setLanguage(code);
    setLanguageOpen(false);
  };

  useEffect(() => {
    const closeLanguageMenu = (event) => {
      if (
        event.type === "keydown" &&
        event.key !== "Escape"
      ) {
        return;
      }

      if (
        event.type === "pointerdown" &&
        languageRef.current?.contains(event.target)
      ) {
        return;
      }

      setLanguageOpen(false);
    };

    document.addEventListener("pointerdown", closeLanguageMenu);
    document.addEventListener("keydown", closeLanguageMenu);

    return () => {
      document.removeEventListener("pointerdown", closeLanguageMenu);
      document.removeEventListener("keydown", closeLanguageMenu);
    };
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 72);

      if (menuOpen || languageOpen || currentScrollY < 100) {
        setHeaderHidden(false);
      } else if (currentScrollY > lastScrollY) {
        setHeaderHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setHeaderHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, [languageOpen, menuOpen]);

  return (
    <header
      className={`site-header ${scrolled ? "scrolled" : ""} ${
        headerHidden ? "header-hidden" : ""
      }`}
    >
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
          className={`language-selector ${languageOpen ? "open" : ""}`}
          ref={languageRef}
        >
          <button
            type="button"
            className="language-switch"
            aria-label={t.languageLabel}
            aria-expanded={languageOpen}
            aria-haspopup="menu"
            aria-controls="language-options"
            onClick={() => setLanguageOpen((current) => !current)}
          >
            <span>{language.toUpperCase()}</span>
            <ChevronDown aria-hidden="true" />
          </button>

          <AnimatePresence>
            {languageOpen && (
              <motion.div
                id="language-options"
                className="language-menu"
                role="menu"
                aria-label={t.languageLabel}
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                {languageCodes.map((code) => (
                  <button
                    key={code}
                    type="button"
                    role="menuitemradio"
                    aria-checked={language === code}
                    className={`language-option ${
                      language === code ? "active" : ""
                    }`}
                    onClick={() => selectLanguage(code)}
                  >
                    <span>{code.toUpperCase()}</span>
                    {language === code && (
                      <Check size={15} aria-hidden="true" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
  const reduceMotion = useReducedMotion();

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <motion.div
        className="hero-media"
        aria-hidden="true"
        animate={
          reduceMotion
            ? { scale: 1.03 }
            : { scale: [1.03, 1.085, 1.03] }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          preload
          sizes="100vw"
          className="hero-image"
        />
      </motion.div>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-reflection" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

      <div className="hero-content container">
        <h1 id="hero-title">
          {t.hero.title}
        </h1>
        <p className="hero-subtitle">
          {t.hero.subtitle}
        </p>
        <p className="hero-description">
          {Array.isArray(t.hero.description)
            ? t.hero.description.map((line) => (
                <span key={line}>{line}</span>
              ))
            : t.hero.description}
        </p>

        <div className="hero-actions">
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
        </div>

        <ul className="hero-chips">
          {t.hero.chips.map((chip, index) => (
            <li key={index}>{chip}</li>
          ))}
        </ul>
      </div>

      <a className="scroll-indicator" href="#experience">
        <span>{t.hero.scroll}</span>
        <span className="scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}

function MotionMarquee({ t }) {
  const items = [
    "MAVIMARIS",
    t.hero.chips[0],
    t.hero.chips[4],
    t.route.title,
    t.hero.chips[1],
    Array.isArray(t.included.title)
      ? t.included.title.join(" ")
      : t.included.title,
  ];

  return (
    <div className="motion-marquee" aria-hidden="true">
      <div className="motion-marquee-track">
        {[0, 1].map((copy) => (
          <div className="motion-marquee-group" key={copy}>
            {items.map((item, index) => (
              <span className="motion-marquee-item" key={`${copy}-${index}`}>
                {item}
                <span className="motion-marquee-dot">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, intro, centered = false }) {
  return (
    <Reveal className={`section-heading ${centered ? "centered" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2
        className={Array.isArray(title) ? "title-lines" : undefined}
        aria-label={Array.isArray(title) ? title.join(" ") : undefined}
      >
        {Array.isArray(title)
          ? title.map((line, index) => (
              <span key={index} aria-hidden="true">
                {line}
              </span>
            ))
          : title}
      </h2>
      {intro && <p className="section-intro">{intro}</p>}
    </Reveal>
  );
}

function ExperienceSection({ t }) {
  const reduceMotion = useReducedMotion();
  const cardControls = useAnimationControls();

  const playCardMotion = () => {
    if (reduceMotion) return;

    cardControls.stop();
    cardControls.start({
      rotateX: [0, 10, -5, 0],
      rotateY: [0, -11, 6, 0],
      scale: [1, 0.96, 1.035, 1],
      y: [0, -10, 4, 0],
      transition: {
        duration: 0.72,
        times: [0, 0.28, 0.64, 1],
        ease: "easeInOut",
      },
    });
  };

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
          <motion.div
            className="experience-card-inner"
            animate={cardControls}
            whileHover={
              reduceMotion
                ? undefined
                : { rotateX: 5, rotateY: -7, scale: 1.025, y: -7 }
            }
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            onTap={playCardMotion}
          >
            <div className="card-topline">
              <Ship aria-hidden="true" />
              <span>{t.experience.cardTitle}</span>
            </div>
            <dl>
              {t.experience.details.map(([label, value], index) => (
                <div key={index}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

function RouteSection({ t }) {
  const reduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const routeRef = useRef(null);
  const draggingRef = useRef(false);
  const totalStops = t.route.stops.length;

  useEffect(() => {
    if (reduceMotion) return undefined;

    const interval = window.setInterval(() => {
      const routeElement = routeRef.current;
      const isFocused = routeElement?.contains(document.activeElement);

      if (
        draggingRef.current ||
        routeElement?.matches(":hover") ||
        isFocused
      ) {
        return;
      }

      setActiveStep((step) => step + 1);
    }, 2300);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const moveCarousel = (direction) => {
    setActiveStep((step) => step + direction);
  };

  const visibleSteps = [-2, -1, 0, 1, 2].map(
    (offset) => activeStep + offset,
  );
  const activeStop = ((activeStep % totalStops) + totalStops) % totalStops;

  return (
    <section className="section route-section" id="route">
      <div className="container">
        <SectionHeading
          eyebrow={t.route.eyebrow}
          title={t.route.title}
          intro={t.route.intro}
        />

        <div className="route-coverflow" ref={routeRef}>
          <motion.div
            className="route-coverflow-stage"
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragStart={() => {
              draggingRef.current = true;
            }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -45) moveCarousel(1);
              if (info.offset.x > 45) moveCarousel(-1);
              draggingRef.current = false;
            }}
          >
            <AnimatePresence initial={false}>
              {visibleSteps.map((virtualStep) => {
                const offset = virtualStep - activeStep;
                const stopIndex =
                  ((virtualStep % totalStops) + totalStops) % totalStops;
                const stop = t.route.stops[stopIndex];
                const isActive = offset === 0;
                const depth = Math.abs(offset);

                return (
                  <motion.article
                    className={`route-coverflow-card ${
                      isActive ? "is-active" : ""
                    }`}
                    key={virtualStep}
                    initial={
                      reduceMotion
                        ? false
                        : {
                            x: "166%",
                            y: 38,
                            scale: 0.62,
                            rotateY: -38,
                            opacity: 0,
                          }
                    }
                    animate={{
                      x: `${-50 + offset * 72}%`,
                      y: depth * 18,
                      scale: isActive ? 1 : depth === 1 ? 0.82 : 0.66,
                      rotateY: isActive ? 0 : offset < 0 ? 34 : -34,
                      rotateZ: isActive ? 0 : offset < 0 ? -1.4 : 1.4,
                      opacity: isActive ? 1 : depth === 1 ? 0.78 : 0.42,
                      zIndex: 10 - depth,
                    }}
                    exit={
                      reduceMotion
                        ? undefined
                        : {
                            x: "-266%",
                            y: 48,
                            scale: 0.58,
                            rotateY: 40,
                            opacity: 0,
                          }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : 1.35,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    aria-hidden={!isActive}
                  >
                    <motion.div
                      className="route-coverflow-card-inner"
                      whileHover={
                        reduceMotion
                          ? undefined
                          : { scale: 1.035, y: -6 }
                      }
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    >
                      <Image
                        src={routeSources[stopIndex]}
                        alt=""
                        fill
                        sizes="(max-width: 760px) 78vw, 48vw"
                      />
                      <div className="route-coverflow-shade" aria-hidden="true" />
                      <div className="route-coverflow-copy">
                        <div className="route-duration">
                          <Clock size={15} aria-hidden="true" />
                          {stop.duration}
                        </div>
                        <h3>{stop.name}</h3>
                        <p>{stop.description}</p>
                      </div>
                    </motion.div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>

          <div className="route-coverflow-controls">
            <button
              type="button"
              onClick={() => moveCarousel(-1)}
              aria-label="Previous route stop"
            >
              <ArrowDown aria-hidden="true" />
            </button>
            <span aria-live="polite">
              {String(activeStop + 1).padStart(2, "0")}
              <small>/ {String(totalStops).padStart(2, "0")}</small>
            </span>
            <button
              type="button"
              onClick={() => moveCarousel(1)}
              aria-label="Next route stop"
            >
              <ArrowDown aria-hidden="true" />
            </button>
          </div>
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
          initial={false}
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {t.included.items.map(([iconKey, label]) => {
            const Icon = includedIcons[iconKey];
            return (
              <motion.article
                className="included-card"
                key={iconKey}
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
      initial={false}
      whileInView={
        reduceMotion
          ? undefined
          : { opacity: [0.6, 1], scale: [0.97, 1] }
      }
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
              key={index}
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
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.055 } },
          }}
        >
          {t.before.items.map((item, index) => (
            <motion.li key={index} variants={reveal}>
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
            <a
              className="final-phone"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={`${t.footer.whatsapp}: +90 535 618 71 31`}
            >
              <MessageCircle size={17} aria-hidden="true" />
              +90 535 618 71 31
            </a>
            <span className="final-trust">
              <Check size={15} aria-hidden="true" />
              {t.final.trust}
            </span>
          </div>
          <motion.aside
            className="price-tag"
            whileHover={{ y: -5, rotate: -1 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`${t.final.priceFrom} €17.00, €13.60 ${t.final.priceUnit}`}
          >
            <span className="price-tag-from">
              {t.final.priceFrom} <del>€17.00</del>
            </span>
            <strong>€13.60</strong>
            <span className="price-tag-unit">{t.final.priceUnit}</span>
          </motion.aside>
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
        <MotionMarquee t={t} />
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
