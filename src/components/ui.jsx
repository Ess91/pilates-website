// Small presentational pieces used across pages.
import { Link } from "react-router-dom";
import { SPRING_LEVELS } from "../data/classes";
import { FAQS } from "../data/content";
import { IMG } from "../data/media";
import { initials } from "../lib/format";
import "./ui.css";

export function Level({ spring }) {
  return (
    <span className={`tag s-${spring}`}>
      <span className="dot" />
      {SPRING_LEVELS[spring]}
    </span>
  );
}

export function SectionHead({ eyebrow, title, action }) {
  return (
    <div className="head">
      <div className="l">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function ArrowLink({ to, children, variant = "" }) {
  return (
    <Link className={`btn arrow ${variant}`} to={to}>
      {children}
    </Link>
  );
}

export function PageHead({ eyebrow, title, lede }) {
  return (
    <section className="phead">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      {lede && <p className="lede">{lede}</p>}
    </section>
  );
}

export function PageBanner({ image, eyebrow, title, lede }) {
  return (
    <section className="pbanner">
      <img src={image} alt="" />
      <div className="wrap">
        <p className="eyebrow on-media">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        {lede && <p className="banner-lede">{lede}</p>}
      </div>
    </section>
  );
}

export function Portrait({ teacher }) {
  return (
    <span className="portrait">
      {teacher.photo ? <img src={teacher.photo} alt={teacher.name} /> : <b>{initials(teacher.name)}</b>}
    </span>
  );
}

export function Faq() {
  return (
    <div className="faq">
      {FAQS.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function OfferBand() {
  return (
    <section className="offer">
      <div className="ph">
        <img src={IMG.plank} alt="Client in a side plank on the reformer" loading="lazy" />
      </div>
      <div className="txt">
        <p className="eyebrow">New to Pilates</p>
        <div className="price">£55</div>
        <h2 className="offer-title">Three classes to find your feet</h2>
        <ul>
          <li>Any class at either studio</li>
          <li>Use them within 14 days</li>
          <li>Free grip socks on your first visit</li>
        </ul>
        <div>
          <ArrowLink to="/pricing" variant="solid">
            Get the intro offer
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}

export function Gallery({ items }) {
  return (
    <div className="gallery">
      {items.map((it) => (
        <figure key={it.src} className={it.size || ""}>
          <img src={it.src} alt={it.alt} loading="lazy" />
        </figure>
      ))}
    </div>
  );
}
