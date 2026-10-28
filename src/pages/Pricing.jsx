import { PLANS } from "../data/content";
import { useStudio } from "../context/StudioContext";
import { Faq, PageHead, SectionHead } from "../components/ui";
import "./Pricing.css";

export default function Pricing() {
  const { purchase, busy } = useStudio();
  return (
    <div className="wrap">
      <PageHead
        eyebrow="One credit books one class, at either studio"
        title="Pricing"
        lede="Start with the intro offer, then pick a pack or go unlimited."
      />
      <section className="sec tight">
        <div className="plans">
          {PLANS.map((p) => (
            <article key={p.id} className={`plan${p.featured ? " feature" : ""}`}>
              <p className="eyebrow">{p.name}</p>
              <div className="pr">£{p.price}</div>
              <span className="muted">{p.unit}</span>
              <ul>
                {p.lines.map((l) => <li key={l}>{l}</li>)}
              </ul>
              <button className={`btn${p.featured ? "" : " solid"}`} disabled={busy} onClick={() => purchase(p)}>
                {p.unlimited ? "Start membership" : "Buy now"}
              </button>
            </article>
          ))}
        </div>
        <p className="note demo-note">Demo checkout: buying adds credits in this browser only. No payment is taken.</p>
      </section>
      <section className="sec">
        <SectionHead eyebrow="Before you book" title="Good to know" />
        <Faq />
      </section>
    </div>
  );
}
