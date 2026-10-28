import { Link } from "react-router-dom";
import { STUDIOS } from "../data/studios";
import { IMG } from "../data/media";
import { useStudio } from "../context/StudioContext";
import { Gallery, PageBanner } from "../components/ui";
import "./Studios.css";

export default function Studios() {
  const { upcoming } = useStudio();
  return (
    <>
      <PageBanner
        image={IMG.lobby}
        eyebrow="Studios"
        title="Islington & Bristol"
        lede="Two calm rooms in north and east London, each with twelve reformers and nothing you don't need."
      />
      <div className="wrap">
        <section className="sec tight">
          <div className="studios">
            {STUDIOS.map((s) => (
              <article className="studio" key={s.id}>
                <div className="ph"><img src={s.image} alt={`${s.name} studio`} loading="lazy" /></div>
                <h2 className="studio-name">{s.name}</h2>
                <dl>
                  <dt>Address</dt><dd>{s.address}</dd>
                  <dt>Getting here</dt><dd>{s.gettingHere}</dd>
                  <dt>Rooms</dt><dd>{s.rooms}</dd>
                  <dt>Facilities</dt><dd>{s.facilities}</dd>
                  <dt>Hours</dt><dd>{s.hours}</dd>
                </dl>
                <div>
                  <Link className="btn solid arrow" to={`/timetable?studio=${s.id}&day=0`}>
                    {upcoming(Infinity, (x) => x.studioId === s.id).length} classes this week
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="sec">
          <Gallery
            items={[
              { src: IMG.matRoom, alt: "Mat studio with green wall", size: "wide tall" },
              { src: IMG.arabesque, alt: "Arched mirrors in the reformer room", size: "tall" },
              { src: IMG.heroPoster, alt: "Clients doing legwork in straps" },
              { src: IMG.classPoster, alt: "Teacher correcting a client" },
            ]}
          />
        </section>
      </div>
    </>
  );
}
