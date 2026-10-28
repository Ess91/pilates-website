// Generates a realistic, repeatable 7-day timetable starting today.
// Only used by the mock booking service. A real platform returns sessions from its API instead.
import { CLASSES, CLASS_BY_ID } from "../data/classes";
import { TEACHERS } from "../data/teachers";

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seeded(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const dateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const WEEKDAY_TIMES = ["06:45", "07:45", "09:30", "12:15", "17:45", "18:45", "19:45"];
const WEEKEND_TIMES = ["08:30", "09:30", "10:45", "12:00"];

export function generateWeek(days = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sessions = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const busy = new Set();

    for (const time of weekend ? WEEKEND_TIMES : WEEKDAY_TIMES) {
      for (const studioId of ["islington", "bristol"]) {
        const r = seeded(hash(dateKey(date) + time + studioId));
        if (studioId === "bristol" && r() < 0.18) continue;

        let pool = CLASSES;
        if (weekend) pool = pool.filter((c) => c.id !== "jump");
        else if (time === "09:30" || time === "12:15") pool = pool.filter((c) => c.id !== "burn");
        let cls = pool[Math.floor(r() * pool.length)];
        if (cls.room === "tower" && studioId === "bristol") cls = CLASS_BY_ID.flow;

        const candidates = TEACHERS.filter((t) => t.teaches.includes(cls.id) && !busy.has(time + t.id)).sort(
          (a, b) => (b.studio === studioId) - (a.studio === studioId)
        );
        if (!candidates.length) continue;
        const teacher = candidates[Math.floor(r() * Math.min(candidates.length, 2))];
        busy.add(time + teacher.id);

        const cap = cls.capacity;
        let booked = r() < 0.14 ? cap : Math.min(cap, Math.floor(cap * (0.25 + r() * 0.8)));
        if (i >= 4) booked = Math.floor(booked * 0.6);

        const order = Array.from({ length: cap }, (_, k) => k + 1);
        for (let k = order.length - 1; k > 0; k--) {
          const j = Math.floor(r() * (k + 1));
          [order[k], order[j]] = [order[j], order[k]];
        }

        const [hh, mm] = time.split(":").map(Number);
        const start = new Date(date);
        start.setHours(hh, mm, 0, 0);

        sessions.push({
          id: `${dateKey(date)}_${time.replace(":", "")}_${studioId}`,
          start,
          dayIndex: i,
          classId: cls.id,
          teacherId: teacher.id,
          studioId,
          capacity: cap,
          takenSpots: order.slice(0, booked),
          waitlistCount: booked === cap ? 1 + Math.floor(r() * 4) : 0,
        });
      }
    }
  }
  return sessions.sort((a, b) => a.start - b.start || a.studioId.localeCompare(b.studioId));
}
