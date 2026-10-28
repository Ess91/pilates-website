import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CLASSES, CLASS_BY_ID } from "../data/classes";
import { TEACHERS, TEACHER_BY_ID } from "../data/teachers";
import { STUDIO_BY_ID } from "../data/studios";
import { IMG, VIDEO } from "../data/media";
import { formatTime, relativeDay } from "../lib/format";
import { useStudio } from "../context/StudioContext";
import BackgroundVideo from "../components/BackgroundVideo";
import SessionRow from "../components/SessionRow";
import { ClassCard, TeacherCard } from "../components/cards";
import { ArrowLink, Faq, Gallery, Level, OfferBand, SectionHead } from "../components/ui";
import "./Home.css";

function NextClassCard() {
  const { upcoming, spotsLeft, openBooking } = useStudio();
  const s = upcoming(1)[0];
  if (!s) return null;
  const c = CLASS_BY_ID[s.classId];
  const left = spotsLeft(s);
  return (
    <aside className="nextcard">
      <span className="t">
        NEXT CLASS · {relativeDay(s.dayIndex, s.start).toUpperCase()} {formatTime(s.start)}
      </span>
      <strong>{c.name}</strong>
      <span className="muted small-text">
        {TEACHER_BY_ID[s.teacherId].name} · {STUDIO_BY_ID[s.studioId].name}
      </span>
      <div className="row2">
        <span className={`spots${left <= 2 ? " low" : ""}`}>{left > 0 ? `${left} spaces left` : "Full"}</span>
        <button className="btn sm solid" onClick={() => openBooking(s.id)}>
          {left > 0 ? "Book" : "Waitlist"}
        </button>
      </div>
    </aside>
  );
}

function Hero() {
  const video = useRef(null);
  const [paused, setPaused] = useState(false);
  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };
  return (
    <section className="hero">
      <BackgroundVideo ref={video} src={VIDEO.hero} poster={IMG.heroPoster} />
      <NextClassCard />
      <div className="wrap">
        <p className="eyebrow on-media">Reformer Pilates · Islington & Bristol</p>
        <h1>Strength, made long.</h1>
        <div className="row">
          <p>Small reformer classes, twelve beds to a room, taught by people who learn your name.</p>
          <div className="ctas">
            <Link className="btn white" to="/timetable">Book a class</Link>
            <Link className="btn light" to="/pricing">3 classes for £55</Link>
          </div>
        </div>
      </div>
      <button className="vidtoggle" onClick={toggle} aria-pressed={paused}>
        {paused ? "Play film" : "Pause film"}
      </button>
    </section>
  );
}

export default function Home() {
  const { sessions, upcoming } = useStudio();
  const names = CLASSES.map((c) => c.name);

  return (
    <>
      <Hero />

      <div className="marquee" aria-hidden="true">
        <div className="track">
          {[...names, ...names].map((n, i) => <span key={i}>{n}</span>)}
        </div>
      </div>

      <div className="wrap">
        <section className="sec split">
          <div className="img">
            <img src={IMG.arabesque} alt="Client balancing in a standing arabesque on a reformer" loading="lazy" />
          </div>
          <div className="txt">
            <p className="eyebrow">The method</p>
            <h2>Built around the reformer</h2>
            <p className="lede">
              Every class works with springs instead of weights. Lighter springs make you work harder for control;
              heavier ones build power. We colour-code every class by its spring load, so you know the effort before you book.
            </p>
            <div className="levels">
              <Level spring="y" />
              <Level spring="b" />
              <Level spring="r" />
            </div>
            <div className="stats">
              <div><strong>{sessions.length}</strong><span>classes this week</span></div>
              <div><strong>12</strong><span>beds per room, never more</span></div>
              <div><strong>{TEACHERS.length}</strong><span>comprehensively trained teachers</span></div>
            </div>
          </div>
        </section>

        <section className="sec">
          <SectionHead eyebrow="Classes" title="Find your class" action={<ArrowLink to="/classes">All classes</ArrowLink>} />
          <div className="rail">
            {CLASSES.map((c) => <ClassCard key={c.id} cls={c} />)}
          </div>
        </section>
      </div>

      <section className="film">
        <BackgroundVideo src={VIDEO.class} poster={IMG.classPoster} />
        <div className="wrap">
          <p className="eyebrow on-media">Inside a class</p>
          <h2 className="narrow-title">Hands-on, every session</h2>
          <p>Teachers walk the room, adjust springs and correct form one bed at a time. Small groups mean nobody hides at the back.</p>
          <div><ArrowLink to="/teachers" variant="white">Meet the teachers</ArrowLink></div>
        </div>
      </section>

      <div className="wrap">
        <section className="sec">
          <SectionHead eyebrow="Live availability" title="Up next" action={<ArrowLink to="/timetable">Full timetable</ArrowLink>} />
          <div className="slots">
            {upcoming(5).map((s) => <SessionRow key={s.id} session={s} />)}
          </div>
        </section>
      </div>

      <div className="band">
        <div className="wrap">
          <SectionHead eyebrow="Teachers" title="The people in the room" action={<ArrowLink to="/teachers">All teachers</ArrowLink>} />
          <div className="tgrid">
            {TEACHERS.slice(0, 4).map((t) => <TeacherCard key={t.id} teacher={t} />)}
          </div>
        </div>
      </div>

      <div className="wrap">
        <section className="sec">
          <SectionHead eyebrow="Two studios" title="Designed to slow you down" action={<ArrowLink to="/studios">Visit the studios</ArrowLink>} />
          <Gallery
            items={[
              { src: IMG.reformerRoom, alt: "Reformer room with rows of oak reformers and a city view", size: "wide tall" },
              { src: IMG.straps, alt: "Feet in straps during reformer legwork", size: "tall" },
              { src: IMG.lobby, alt: "Studio entrance with lit display wall" },
              { src: IMG.back, alt: "Close-up of back muscles during a stretch" },
            ]}
          />
        </section>
      </div>

      <OfferBand />

      <div className="wrap">
        <section className="sec">
          <SectionHead eyebrow="First visit" title="Questions" />
          <Faq />
        </section>
      </div>
    </>
  );
}
