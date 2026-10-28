import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CLASSES } from "../data/classes";
import { TEACHERS } from "../data/teachers";
import { STUDIOS } from "../data/studios";
import { dayShort, formatDay, formatDayMonth } from "../lib/format";
import { useStudio } from "../context/StudioContext";
import SessionRow from "../components/SessionRow";
import { PageHead } from "../components/ui";
import "./Timetable.css";

// Filters live in the URL (?day=2&class=flow&teacher=maya-okafor&studio=islington) so links and the back button work.
export default function Timetable() {
  const { sessions, loading, firstDayWith } = useStudio();
  const [params, setParams] = useSearchParams();
  const studio = params.get("studio") || "all";
  const cls = params.get("class") || "all";
  const teacher = params.get("teacher") || "all";

  const matches = (s) =>
    (studio === "all" || s.studioId === studio) &&
    (cls === "all" || s.classId === cls) &&
    (teacher === "all" || s.teacherId === teacher);

  const day = params.has("day") ? Number(params.get("day")) : firstDayWith(matches);

  const days = useMemo(() => {
    const seen = new Map();
    sessions.forEach((s) => !seen.has(s.dayIndex) && seen.set(s.dayIndex, s.start));
    return [...seen.entries()];
  }, [sessions]);

  const dayDate = days.find(([i]) => i === day)?.[1];
  const list = sessions.filter((s) => s.dayIndex === day && matches(s));
  const filtered = studio !== "all" || cls !== "all" || teacher !== "all";

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };
  const clear = () => setParams(params.has("day") ? { day: String(day) } : {}, { replace: true });

  return (
    <div className="wrap">
      <PageHead eyebrow="Book up to 7 days ahead · free cancellation until 12h before" title="Timetable" />
      <section className="sec tight timetable">
        <div className="days" role="group" aria-label="Choose day">
          {days.map(([i, date]) => (
            <button key={i} className="day" aria-pressed={day === i} onClick={() => update("day", String(i))}>
              <b>{i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayShort(date)}</b> {formatDayMonth(date)}
            </button>
          ))}
        </div>

        <div className="filters">
          <label htmlFor="fStudio">
            Studio
            <select id="fStudio" value={studio} onChange={(e) => update("studio", e.target.value)}>
              <option value="all">Both studios</option>
              {STUDIOS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label htmlFor="fClass">
            Class
            <select id="fClass" value={cls} onChange={(e) => update("class", e.target.value)}>
              <option value="all">All classes</option>
              {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label htmlFor="fTeacher">
            Teacher
            <select id="fTeacher" value={teacher} onChange={(e) => update("teacher", e.target.value)}>
              <option value="all">All teachers</option>
              {TEACHERS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          {filtered && <button className="linkish clear" onClick={clear}>Clear filters</button>}
        </div>

        {loading ? (
          <p className="empty">Loading the timetable…</p>
        ) : (
          <>
            <p className="note count">
              {dayDate ? formatDay(dayDate) : ""} · {list.length} class{list.length === 1 ? "" : "es"}
            </p>
            <div className="slots">
              {list.length ? (
                list.map((s) => <SessionRow key={s.id} session={s} />)
              ) : (
                <p className="empty">
                  Nothing matches on this day. Try another day or{" "}
                  <button className="linkish" onClick={clear}>clear the filters</button>.
                </p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
