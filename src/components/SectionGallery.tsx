import type { Content, DoorKey } from "../lib/types";
import { ExhibitCard } from "./ExhibitCard";

export function SectionGallery(props: { content: Content; doorKey: DoorKey; onOpenExhibit: (id: string) => void }) {
  const { content, doorKey, onOpenExhibit } = props;
  const door = content.doors.find((d) => d.key === doorKey);
  const exhibits = content.exhibits[doorKey];

  return (
    <section aria-label="Section Gallery">
      <div className="sectionHead">
        <div className="breadcrumb">Hall → {door?.title}</div>
        <div className="sectionTitle">{door?.title}</div>
        <div className="sectionThesis">{door?.thesis}</div>
      </div>

      <div className="gallery">
        {exhibits.map((e) => (
          <ExhibitCard key={e.id} exhibit={e} layoutId={`exhibit-${e.id}`} onOpen={() => onOpenExhibit(e.id)} />
        ))}
      </div>
    </section>
  );
}
