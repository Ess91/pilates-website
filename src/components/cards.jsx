import { Link } from "react-router-dom";
import { TEACHERS } from "../data/teachers";
import { STUDIO_BY_ID } from "../data/studios";
import { Level, Portrait } from "./ui";
import "./cards.css";

export function ClassCard({ cls, detailed = false }) {
  const teachers = TEACHERS.filter((t) => t.teaches.includes(cls.id))
    .map((t) => t.name.split(" ")[0])
    .join(", ");
  return (
    <Link className="ccard" to={`/timetable?class=${cls.id}`}>
      <span className="ph">
        <img src={cls.image} alt={`${cls.name} class`} loading="lazy" />
      </span>
      <span className="info">
        <span className="meta">
          <Level spring={cls.spring} />
          <span className="tag">{cls.mins} min</span>
        </span>
        <h3>{cls.name}</h3>
        <p>{cls.description}</p>
        {detailed && (
          <span className="more">
            <span><b>Best for</b> {cls.bestFor}</span>
            <span><b>Teachers</b> {teachers}</span>
          </span>
        )}
        <span className="see-times arrow">See times </span>
      </span>
    </Link>
  );
}

export function TeacherCard({ teacher }) {
  return (
    <Link className="tcard" to={`/teachers/${teacher.id}`}>
      <Portrait teacher={teacher} />
      <span className="who">
        <h3>{teacher.name}</h3>
        <span>
          {teacher.role} · {STUDIO_BY_ID[teacher.studio].name}
        </span>
      </span>
    </Link>
  );
}
