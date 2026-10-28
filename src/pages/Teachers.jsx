import { TEACHERS } from "../data/teachers";
import { TeacherCard } from "../components/cards";
import { PageHead } from "../components/ui";

export default function Teachers() {
  const years = TEACHERS.reduce((sum, t) => sum + t.years, 0);
  return (
    <div className="wrap">
      <PageHead
        eyebrow={`${TEACHERS.length} teachers · ${years} years combined`}
        title="Teachers"
        lede="Every teacher holds a comprehensive certification of 450+ hours and teaches no more than 12 people at once."
      />
      <section className="sec tight">
        <div className="tgrid">
          {TEACHERS.map((t) => <TeacherCard key={t.id} teacher={t} />)}
        </div>
      </section>
    </div>
  );
}
