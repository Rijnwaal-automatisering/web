import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import Icon from "../components/Icon.jsx";
import { ease, reveal, stagger, inView } from "../shared.jsx";
import { url } from "../router.jsx";

const STEPS = [
  {
    icon: "chat", title: "Kennismaken en wensen afstemmen",
    body: "We gaan samen in gesprek over je bedrijf en je werkweek. Welke taken kosten de meeste tijd en wat wil je bereiken? Tegelijk kijken we of we een goede match zijn. Klikt het niet, dan zeg ik dat eerlijk.",
    items: ["Gratis gesprek van 30 minuten", "Je wensen op een rij", "Eerlijk antwoord: match of niet"],
  },
  {
    icon: "form", title: "Plan maken en ondertekenen",
    body: "Ik werk een plan van aanpak uit: welke automatiseringen, in welke volgorde, wat het kost en wanneer het klaar is. We lopen het samen door en ondertekenen het allebei, zodat we precies weten wat we afspreken.",
    items: ["Plan van aanpak", "Vaste prijs en planning", "Samen ondertekend"],
  },
  {
    icon: "server", title: "n8n inrichten en automatiseringen bouwen",
    body: "Ik richt je eigen n8n-omgeving in, gehost in de EU, en bouw alle afgesproken automatiseringen. Alles wordt getest met echte voorbeelden en netjes gedocumenteerd.",
    items: ["n8n-omgeving in de EU", "Alle automatiseringen gebouwd", "Getest en gedocumenteerd"],
  },
  {
    icon: "bolt", title: "Live in productie",
    body: "Als je dat wilt, zetten we de oplossing in productie met een uitrolstrategie. Bijvoorbeeld eerst een tijdje naast je huidige werkwijze, daarna volledig. Zo verloopt de overstap zonder verrassingen.",
    items: ["Uitrolstrategie op maat", "Stap voor stap live", "Monitoring en nazorg"],
  },
];

const DOT_X = [0.1, 0.9]; // keep in sync with .road-row--left/right .road-dot in styles.css

// A path that winds from the top of the page past every step. Between two steps it sweeps
// across under the card and makes a curl in the empty space beside the next card.
function buildPath(w, h) {
  const rowH = h / STEPS.length;
  const r = Math.max(36, Math.min(70, w * 0.05)); // curl radius
  const pts = STEPS.map((_, i) => [w * DOT_X[i % 2], rowH * (i + 0.5)]);
  const f = (n) => n.toFixed(1);
  const [x0, y0] = pts[0];
  let d = `M${f(w / 2)} ${f(-40)} C${f(w / 2)} ${f(rowH * 0.2)} ${f(x0)} ${f(y0 - rowH * 0.35)} ${f(x0)} ${f(y0)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const s = Math.sign(bx - ax);
    const cx = bx - s * w * 0.14; // curl centre: beside the next card, just above it
    const cy = (ay + by) / 2 - r * 1.2;
    const bottom = cy + r;
    const sweep = s > 0 ? 0 : 1; // counter-clockwise when travelling right, clockwise when travelling left
    d += ` C${f(ax)} ${f(ay + rowH * 0.42)} ${f(cx - s * w * 0.3)} ${f(bottom)} ${f(cx)} ${f(bottom)}`;
    d += ` A${f(r)} ${f(r)} 0 0 ${sweep} ${f(cx)} ${f(cy - r)}`;
    d += ` A${f(r)} ${f(r)} 0 0 ${sweep} ${f(cx + s * 0.5)} ${f(bottom)}`;
    d += ` C${f(cx + s * w * 0.1)} ${f(bottom)} ${f(bx)} ${f(by - rowH * 0.3)} ${f(bx)} ${f(by)}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  d += ` C${f(lx)} ${f(ly + rowH * 0.42)} ${f(w / 2)} ${f(h - rowH * 0.2)} ${f(w / 2)} ${f(h + 40)}`;
  return d;
}

function Road() {
  const ref = useRef(null);
  const [size, setSize] = useState(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const d = size && buildPath(size.w, size.h);

  return (
    <section className="section section--road">
      <div className="road" ref={ref}>
        {d && (
          <svg className="road-line" viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
            <defs>
              <linearGradient id="road-grad" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#2563eb" /><stop offset="1" stopColor="#0891b2" />
              </linearGradient>
            </defs>
            <path d={d} className="road-track" />
            <motion.path d={d} className="road-fill" style={{ pathLength: progress }} />
          </svg>
        )}
        <ol className="road-steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className={`road-row road-row--${i % 2 ? "right" : "left"}`}>
              <motion.span className="road-dot" aria-hidden="true"
                initial={{ scale: 0.4, opacity: 0.4 }} whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-35% 0px" }} transition={{ type: "spring", visualDuration: 0.5, bounce: 0.4 }}>
                {i + 1}
              </motion.span>
              <motion.article className="road-card"
                initial={{ opacity: 0, x: i % 2 ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20% 0px" }} transition={{ duration: 0.8, ease }}>
                <div className="road-card-top">
                  <span className="card-icon"><Icon name={s.icon} size={22} /></span>
                  <span className="road-n">Stap {i + 1}</span>
                </div>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
                <ul className="ticks">
                  {s.items.map((x) => <li key={x}><Icon name="check" size={16} />{x}</li>)}
                </ul>
              </motion.article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="section page-hero" id="top">
      <motion.div className="section-head section-head--center" initial="hidden" animate="show" variants={stagger(0.1, 0.2)}>
        <motion.h1 variants={reveal}>Van eerste gesprek tot <span className="grad">draaiende automatisering.</span></motion.h1>
        <motion.p className="sub" variants={reveal}>
          In vier stappen, zonder verrassingen. Je weet altijd waar we staan, wat het kost en wat er als volgende gebeurt.
        </motion.p>
      </motion.div>
    </section>
  );
}

function Cta() {
  return (
    <section className="section">
      <motion.div className="cta-panel cta-panel--simple" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={inView} transition={{ duration: 0.8, ease }}>
        <div>
          <p className="eyebrow"><span className="dot" /> Stap 1</p>
          <h2>Zullen we kennismaken?</h2>
          <p className="sub">Een gratis gesprek van 30 minuten. Daarna weet je of we een match zijn en wat je kunt verwachten.</p>
        </div>
        <a href={url("/contact/")} className="btn">Plan een kennismaking <Icon name="arrow" size={18} /></a>
      </motion.div>
    </section>
  );
}

export default function Process() {
  return (
    <>
      <Intro />
      <Road />
      <Cta />
    </>
  );
}
