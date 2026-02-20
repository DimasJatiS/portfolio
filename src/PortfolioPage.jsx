import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import './styles/portfolio.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, ScrollSmoother);

/* ------------------------------------------------------------------
   Data
   ------------------------------------------------------------------ */
const PROJECTS = [
  {
    id: 1, num: '01', name: 'Bloomarie', title1: 'Bloom', title2: 'arie',
    description: 'Flowers bouquet sales store with user authentication and seamless third-party payment integration. Full-stack web app with product catalog, cart, and order management.',
    tags: ['PHP', 'MySQL', 'Bootstrap'],
    url: 'https://github.com/DimasJatiS/UAS_PPW.git',
    img: '/Bloomarie.png',
  },
  {
    id: 2, num: '02', name: 'Inofa', title1: 'In', title2: 'ofa',
    description: 'Matchmaking platform — web & mobile app with real-time live chat, advanced filter and search, and cross-platform sync for both Android and browser.',
    tags: ['React', 'Node.js', 'Flutter', 'WebSocket'],
    url: 'https://github.com/daffaadz/inofa-web-app.git',
    img: '/inofa.png',
  },
  {
    id: 3, num: '03', name: 'AI CV Screen', title1: 'AI', title2: 'Screen',
    description: 'AI-powered CV scoring system using Node.js, Gemini API, and PostgreSQL with Prisma ORM. Modular backend architecture that evaluates candidates by skill relevance.',
    tags: ['Node.js', 'Gemini API', 'PostgreSQL', 'Prisma'],
    url: 'https://ai-recruitment-screening-gdg-web.vercel.app/',
    img: '/ai-cv-screen.png',
  },
];

const SKILLS = [
  {
    category: 'Languages & Frameworks', type: 'lang',
    items: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PHP', 'Java', 'Kotlin', 'Flutter', 'SQL'],
  },
  {
    category: 'Tools & Platforms', type: 'tool',
    items: ['Git', 'PostgreSQL', 'MongoDB', 'Prisma ORM', 'Tailwind CSS', 'GSAP', 'Android Studio', 'IntelliJ IDEA', 'VS Code', 'Vite'],
  },
  {
    category: 'Creative & Soft Skills', type: 'soft',
    items: ['Figma', 'Adobe Photoshop', 'Lightroom', 'Illustrator', 'OBS Studio', 'Microsoft Office', 'Event Management', 'Cross-functional teamwork'],
  },
];

/* ------------------------------------------------------------------
   Component
   ------------------------------------------------------------------ */
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;

export default function PortfolioPage() {
  const slideIDRef = useRef(0);
  const [navOpen, setNavOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle | sending | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!FORMSPREE_ID) {
      alert('Formspree ID belum dikonfigurasi. Tambahkan VITE_FORMSPREE_ID di file .env');
      return;
    }
    setFormStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/mbdaavrp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setFormStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  }

  useEffect(() => {
    const select    = (e) => document.querySelector(e);
    const selectAll = (e) => document.querySelectorAll(e);

    const stage  = select('.stage');
    const slides = selectAll('.slide');
    const links  = selectAll('.slide__scroll-link');
    const titles = selectAll('.col__content-title');

    let introTitle, splitTitles;
    if (select('.intro__title')) {
      introTitle  = new SplitText('.intro__title', { type: 'lines', linesClass: 'intro-line' });
    }
    if (titles.length) {
      splitTitles = new SplitText(titles, { type: 'lines, chars', linesClass: 'line', charsClass: 'char', position: 'relative' });
    }

    const smoother = ScrollSmoother.create({ smooth: 2, effects: true, smoothTouch: 0.1 });

    function initHeader() {
      const tl = gsap.timeline({ delay: 0.5 });
      tl.from('.logo', { y: -40, opacity: 0, duration: 2, ease: 'power4' })
        .from('.nav-links li', { y: -20, opacity: 0, duration: 1.4, ease: 'power4', stagger: 0.1 }, 0.8);
    }

    function initIntro() {
      const tl = gsap.timeline({ delay: 1 });
      tl.from('.intro-line',    { y: 300, ease: 'power4', duration: 3 })
        .from('.intro__eyebrow',{ x: -60, opacity: 0, ease: 'power4', duration: 2 }, 0.5)
        .from('.intro__tagline',{ x: -60, opacity: 0, ease: 'power4', duration: 2 }, 0.7)
        .from('.intro__scroll-hint', { opacity: 0, duration: 2, ease: 'power4' }, 1.2);

      const stl = gsap.timeline({
        scrollTrigger: { trigger: '.intro', scrub: 1, start: 'top bottom', end: 'bottom top' },
      });
      stl.to('.intro__title',  { x: 300, ease: 'power4.in', duration: 3 })
         .to('.intro__tagline',{ y: 80,  ease: 'power4.in', duration: 3 }, 0);
    }

    function initAbout() {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.about', start: '20% 70%' } });
      tl.from('.about__title',     { y: 60, opacity: 0, duration: 2,   ease: 'power4' })
        .from('.about__label',     { x: -40,opacity: 0, duration: 1.5, ease: 'power4' }, 0)
        .from('.about__txt',       { y: 40, opacity: 0, duration: 1.8, ease: 'power4' }, 0.3)
        .from('.about__stat-num',  { y: 30, opacity: 0, duration: 1.5, ease: 'power4', stagger: 0.15 }, 0.5)
        .from('.about__deco-ring', { scale: 0, opacity: 0, duration: 2, ease: 'power4', stagger: 0.2, transformOrigin: 'center' }, 0.2);
    }

    function scrollTop() {
      gsap.to(window, { duration: 2, scrollTo: { y: '#slide-0' }, ease: 'power2.inOut' });
    }

    function initLinks() {
      links.forEach((link, index) => {
        const linkST = link.querySelector('.slide__scroll-line');
        link.addEventListener('click', (e) => {
          e.preventDefault();
          gsap.to(window, { duration: 2, scrollTo: { y: '#slide-' + (index + 2) }, ease: 'power2.inOut' });
          slideIDRef.current++;
        });
        link.addEventListener('mouseover', () =>
          gsap.to(linkST, { y: 40, transformOrigin: 'bottom center', duration: 0.6, ease: 'power4' })
        );
        link.addEventListener('mouseout', () =>
          gsap.to(linkST, { y: 0, transformOrigin: 'bottom center', duration: 0.6, ease: 'power4' })
        );
      });

      const top = select('.footer__link-top');
      if (top) {
        top.addEventListener('click', (e) => { e.preventDefault(); scrollTop(); });
        top.addEventListener('mouseover', () =>
          gsap.to('.footer__link-top-line', { scaleY: 3, transformOrigin: 'bottom center', duration: 0.6, ease: 'power4' })
        );
        top.addEventListener('mouseout', () =>
          gsap.to('.footer__link-top-line', { scaleY: 1, transformOrigin: 'bottom center', duration: 0.6, ease: 'power4' })
        );
      }
    }

    function initSlides() {
      slides.forEach((slide) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: slide, start: '40% 50%' } });
        tl.from(slide.querySelectorAll('.col__content-title'), { ease: 'power4', y: '+=5vh', duration: 2.5 })
          .from(slide.querySelectorAll('.line__inner'),        { y: 200,  duration: 2,   ease: 'power4', stagger: 0.1 }, 0)
          .from(slide.querySelectorAll('.project-num'),        { x: -40, opacity: 0, duration: 1.5, ease: 'power4' }, 0)
          .from(slide.querySelectorAll('.project-tags'),       { x: -40, opacity: 0, duration: 1.5, ease: 'power4' }, 0.2)
          .from(slide.querySelectorAll('.col__content-txt'),   { x: 60,  opacity: 0, duration: 2,   ease: 'power4' }, 0.4)
          .from(slide.querySelectorAll('.slide-link'),         { scale: 0, opacity: 0, duration: 1.5, ease: 'back(2)', transformOrigin: 'center' }, 0.5)
          .from(slide.querySelectorAll('.slide__scroll-link'), { y: 200,  duration: 3,   ease: 'power4' }, 0.4)
          .to(slide.querySelectorAll('.slide__scroll-line'),   { scaleY: 0.6, transformOrigin: 'bottom left', duration: 2.5, ease: 'elastic(1,0.5)' }, 1.4);
      });

      gsap.from('.footer__name', {
        scrollTrigger: { trigger: '.footer', scrub: 2, start: '50% 100%', end: '0% 0%' },
        y: '20vh', ease: 'sine',
      });
    }

    function initParallax() {
      slides.forEach((slide) => {
        const imageWrappers = slide.querySelectorAll('.col__image-wrap');
        gsap.fromTo(imageWrappers, { y: '-30vh' }, {
          y: '30vh',
          scrollTrigger: { trigger: slide, scrub: true, start: 'top bottom', snap: { snapTo: 0.5, duration: 1, ease: 'power4.inOut' } },
          ease: 'none',
        });
      });
    }

    function initSkills() {
      gsap.from('.section-title', { scrollTrigger: { trigger: '.skills', start: '10% 80%' }, y: 60, opacity: 0, duration: 2, ease: 'power4' });
      selectAll('.skill-chip').forEach((chip, i) => {
        gsap.from(chip, {
          scrollTrigger: { trigger: chip, start: '0% 90%' },
          y: 30, opacity: 0, duration: 0.8, ease: 'power3',
          delay: (i % 10) * 0.05,
        });
      });
    }

    function initContact() {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.contact', start: '20% 70%' } });
      tl.from('.contact__big',  { y: 60, opacity: 0, duration: 2,   ease: 'power4' })
        .from('.contact-social .contact-btn', { y: 30, opacity: 0, duration: 1.5, ease: 'power4', stagger: 0.1 }, 0.4)
        .from('.contact__form', { y: 40, opacity: 0, duration: 1.8, ease: 'power4' }, 0.5)
        .from('.contact__note', { y: 20, opacity: 0, duration: 1.5, ease: 'power4' }, 0.7);
    }

    function initKeys(e) {
      if (e.keyCode === 40) {
        e.preventDefault();
        if (slideIDRef.current <= slides.length) {
          slideIDRef.current++;
          gsap.to(window, { duration: 2, scrollTo: { y: '#slide-' + slideIDRef.current }, ease: 'power2.inOut' });
        }
      } else if (e.keyCode === 38) {
        e.preventDefault();
        slideIDRef.current = 0;
        scrollTop();
      }
    }

    gsap.set(stage, { autoAlpha: 1 });
    initHeader();
    initIntro();
    initAbout();
    initLinks();
    initSlides();
    initParallax();
    initSkills();
    initContact();
    document.addEventListener('keydown', initKeys);

    return () => {
      document.removeEventListener('keydown', initKeys);
      smoother && smoother.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      introTitle  && introTitle.revert();
      splitTitles && splitTitles.revert();
    };
  }, []);

  const scrollTo = (id) => {
    gsap.to(window, { duration: 1.8, scrollTo: { y: id }, ease: 'power2.inOut' });
    setNavOpen(false);
  };

  return (
    <>
      {/* Mobile nav overlay */}
      <div className={'nav-overlay' + (navOpen ? ' is-open' : '')}>
        <button className="nav-overlay__close" onClick={() => setNavOpen(false)}>&#x2715;</button>
        {[['#slide-0','Home'],['#about','About'],['#projects-header','Projects'],['#skills','Skills'],['#contact','Contact']].map(([href, label]) => (
          <a key={href} href={href} onClick={(e) => { e.preventDefault(); scrollTo(href); }}>{label}</a>
        ))}
      </div>

      <div id="smooth-wrapper">
        <div className="stage" id="smooth-content">

          {/* Header */}
          <header className="header">
            <div className="logo">DJS</div>
            <nav>
              <ul className="nav-links">
                {[['#about','About'],['#projects-header','Projects'],['#skills','Skills'],['#contact','Contact']].map(([href, label]) => (
                  <li key={href}>
                    <a href={href} onClick={(e) => { e.preventDefault(); scrollTo(href); }}>{label}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <button className="nav-btn" aria-label="Menu" onClick={() => setNavOpen(true)}>
              <svg className="nav-btn__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24">
                <rect width="36" height="2" x="0" y="0"  fill="#6b6b99" />
                <rect width="28" height="2" x="0" y="11" fill="#6b6b99" />
                <rect width="20" height="2" x="0" y="22" fill="#6b6b99" />
              </svg>
            </button>
          </header>

          {/* Hero */}
          <section className="intro" id="slide-0">
            <div className="intro__content">
              <p className="intro__eyebrow">Backend Developer &amp; Long Live Learner</p>
              <h1 className="intro__title">Dimas<br /><span className="neon">Jati</span></h1>
              <p className="intro__tagline">Applied Software Engineering · Universitas Gadjah Mada<br />Web3 · Renewable Energy · Event Management</p>
            </div>
            <div className="intro__scroll-hint">
              <div className="intro__scroll-line" />
              <span>Scroll</span>
            </div>
          </section>

          {/* About */}
          <section className="about" id="about">
            <div className="about__grid">
              <div>
                <p className="about__label">About Me</p>
                <h2 className="about__title">Who I Am</h2>
                <p className="about__txt">
                  <span className="about__highlight">Applied Software Engineering student</span> at Universitas Gadjah Mada with a strong interest in technology — especially{' '}
                  <span className="about__highlight">Web3, renewable energy, and event management</span>.
                  Experienced in cross-functional teamwork through roles as event organizer, cashier, and technical competition leader.
                  <br /><br />
                  Skilled in problem-solving, communication, and delivering practical solutions across academic and real-world environments.
                </p>
                <div className="about__stats">
                  <div><div className="about__stat-num">3+</div><div className="about__stat-label">Projects Shipped</div></div>
                  <div><div className="about__stat-num">10+</div><div className="about__stat-label">Technologies</div></div>
                  <div><div className="about__stat-num">UGM</div><div className="about__stat-label">University</div></div>
                </div>
              </div>
              <div className="about__photo-wrap">
                <img src="/dimas.jpeg" alt="Dimas Jati Satria" />
                <span className="about__photo-corner about__photo-corner--tl" />
                <span className="about__photo-corner about__photo-corner--tr" />
                <span className="about__photo-corner about__photo-corner--bl" />
                <span className="about__photo-corner about__photo-corner--br" />
              </div>
            </div>
          </section>

          {/* Projects label */}
          <div className="projects-header" id="projects-header">
            <div>
              <p className="section-label">Selected Work</p>
              <h2 className="section-title">Projects</h2>
            </div>
          </div>

          {/* Project slides */}
          {PROJECTS.map((project, index) => (
            <section key={project.id} className={`slide slide--${project.id}`} id={`slide-${project.id}`}>
              <div className="col col--1">
                <div className={`col__content col__content--${project.id}`}>
                  <p className="project-num">{project.num} — {project.name}</p>
                  <div className="project-tags">
                    {project.tags.map(tag => <span key={tag} className="project-tag">{tag}</span>)}
                  </div>
                  <h2 className="col__content-title">
                    <span className="line__inner">{project.title1}</span>
                    <br />
                    <span className="line__inner">{project.title2}</span>
                  </h2>
                  <div className="col__content-wrap">
                    <p className="col__content-txt">{project.description}</p>
                    <a
                      className="slide-link"
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="slide-link__circ" />
                      <span className="slide-link__label">View<br />Demo</span>
                    </a>
                  </div>
                </div>
                {index < PROJECTS.length - 1 && (
                  <a href={`#slide-${project.id + 1}`} className="slide__scroll-link">
                    <div className="slide__scroll-line" />
                  </a>
                )}
              </div>
              <div className="col col--2">
                <div className="col__image-wrap">
                  <img className="img img--1" src={project.img} alt={project.name} />
                </div>
              </div>
            </section>
          ))}

          {/* Tech Stack */}
          <section className="skills" id="skills">
            <div className="skills__inner">
              <p className="section-label">Capabilities</p>
              <h2 className="section-title">Tech Stack</h2>
              <div className="skills__categories">
                {SKILLS.map((group) => (
                  <div key={group.category}>
                    <p className="skills__category-name">{group.category}</p>
                    <div className="skills__grid">
                      {group.items.map((item) => (
                        <span key={item} className={`skill-chip skill-chip--${group.type}`}>
                          <span className="skill-chip__dot" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="contact" id="contact">
            <div className="contact__inner">
              <p className="section-label">Get In Touch</p>
              <h2 className="contact__big">
                Let's<br /><span className="neon">Work</span><br />Together
              </h2>

              {/* Social links */}
              <div className="contact-social">
                <a className="contact-btn" href="mailto:jati.satria000@gmail.com">Email</a>
                <a className="contact-btn" href="https://github.com/DimasJatiS" target="_blank" rel="noreferrer">GitHub</a>
                <a className="contact-btn" href="https://linkedin.com/in/dimasjatisatria" target="_blank" rel="noreferrer">LinkedIn</a>
                <a className="contact-btn" href="https://instagram.com/Dimaassatriaa1" target="_blank" rel="noreferrer">Instagram</a>
                <a className="contact-btn" href="line://ti/p/~dimasjs1029" title="Line ID: dimasjs1029">Line</a>
              </div>

              {/* Contact Form */}
              <form className="contact__form" onSubmit={handleSubmit} noValidate>
                <div className="contact__form-row">
                  <div className="contact__field">
                    <label className="contact__label" htmlFor="cf-name">Name</label>
                    <input
                      id="cf-name" className="contact__input" type="text"
                      placeholder="Your name" required
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="contact__field">
                    <label className="contact__label" htmlFor="cf-email">Email</label>
                    <input
                      id="cf-email" className="contact__input" type="email"
                      placeholder="your@email.com" required
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="contact__field">
                  <label className="contact__label" htmlFor="cf-msg">Message</label>
                  <textarea
                    id="cf-msg" className="contact__input contact__textarea"
                    placeholder="Tell me about your project or opportunity..." required rows={5}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  />
                </div>
                <div className="contact__form-footer">
                  <button
                    className="contact-btn contact-btn--primary"
                    type="submit"
                    disabled={formStatus === 'sending' || formStatus === 'success'}
                  >
                    {formStatus === 'sending' ? 'Sending…' : formStatus === 'success' ? '✓ Sent!' : 'Send Message'}
                  </button>
                  {formStatus === 'error' && (
                    <span className="contact__form-msg contact__form-msg--error">
                      Failed to send. Please try again or email directly.
                    </span>
                  )}
                  {formStatus === 'success' && (
                    <span className="contact__form-msg contact__form-msg--success">
                      Message received — I'll get back to you soon.
                    </span>
                  )}
                </div>
              </form>

              <p className="contact__note">
                Open to internship, freelance projects, and tech collaborations.
                <br />
                <span style={{ fontSize: '11px', letterSpacing: '1px', color: 'var(--muted)' }}>LINE ID: dimasjs1029</span>
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="footer" id="slide-7">
            <h2 className="footer__name">Dimas<span> Jati</span></h2>
            <p className="footer__tagline">Backend Developer · UGM</p>
            <a
              className="footer__link-top"
              href="#slide-0"
              onClick={(e) => { e.preventDefault(); gsap.to(window, { duration: 2, scrollTo: { y: '#slide-0' }, ease: 'power2.inOut' }); }}
            >
              Top
              <span className="footer__link-top-line" />
            </a>
            <p className="footer__legal">© 2026 Dimas Jati Satria · All rights reserved</p>
          </footer>

        </div>
      </div>
    </>
  );
}
