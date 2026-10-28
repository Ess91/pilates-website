import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { TEACHER_BY_ID } from "../data/teachers";
import { CLASS_BY_ID } from "../data/classes";
import { STUDIO_BY_ID } from "../data/studios";
import { useStudio } from "../context/StudioContext";
import SessionRow from "../components/SessionRow";
import { ArrowLink, Portrait, SectionHead } from "../components/ui";
import NotFound from "./NotFound";
import "./TeacherProfile.css";

export default function TeacherProfile() {
  const { id } = useParams();
  const { upcoming } = useStudio();
  const t = TEACHER_BY_ID[id];
  useEffect(() => {
    if (t) document.title = `${t.name} · Pilates`;
  }, [t]);
  if (!t) return <NotFound />;

  const first = t.name.split(" ")[0];
  const all = upcoming(Infinity, (s) => s.teacherId === t.id);

  return (
    <div className="wrap">
      <p className="back-link">
        <Link className="linkish" to="/teachers">← All teachers</Link>
      </p>
      <section className="profile">
        <Portrait teacher={t} />
        <div className="info">
          <p className="eyebrow">{t.role} · {STUDIO_BY_ID[t.studio].name}</p>
          <h1 className="profile-name">{t.name}</h1>
          <blockquote>“{t.quote}”</blockquote>
          <p className="lede">{t.bio}</p>
          <div className="pills">
            {t.specialties.map((s) => <span className="pill" key={s}>{s}</span>)}
          </div>
          <div className="kstats">
            <div><strong>{t.years}</strong><span>years teaching</span></div>
            <div><strong>{all.length}</strong><span>classes this week</span></div>
            <div><strong>{t.teaches.length}</strong><span>class formats</span></div>
          </div>
          <div className="pills">
            {t.teaches.map((c) => (
              <span className={`pill s-${CLASS_BY_ID[c].spring}`} key={c}>
                <span className="dot" />
                {CLASS_BY_ID[c].name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <SectionHead
          eyebrow={`Next with ${first}`}
          title={`Book a class with ${first}`}
          action={<ArrowLink to={`/timetable?teacher=${t.id}`}>All {first}'s classes</ArrowLink>}
        />
        <div className="slots">
          {all.length ? all.slice(0, 6).map((s) => <SessionRow key={s.id} session={s} />) : <p className="empty">No classes left this week.</p>}
        </div>
      </section>
    </div>
  );
}
