import { CLASSES } from "../data/classes";
import { IMG } from "../data/media";
import { ClassCard } from "../components/cards";
import { OfferBand, PageBanner } from "../components/ui";

export default function Classes() {
  return (
    <>
      <PageBanner
        image={IMG.straps}
        eyebrow="Classes"
        title="Seven ways in"
        lede="Every class is colour-coded by spring load. Yellow is light and controlled, blue is the all-rounder, red is heavy and fast."
      />
      <div className="wrap">
        <section className="sec tight">
          <div className="cgrid">
            {CLASSES.map((c) => <ClassCard key={c.id} cls={c} detailed />)}
          </div>
        </section>
      </div>
      <OfferBand />
    </>
  );
}
