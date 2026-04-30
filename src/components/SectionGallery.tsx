import type { Content, DoorKey } from "../lib/types";
import { ExhibitCard } from "./ExhibitCard";

export function SectionGallery(props: {
  content: Content;
  doorKey: DoorKey;
  onOpenExhibit: (id: string) => void;
  onGoHome?: () => void;
}) {
  const { content, doorKey, onOpenExhibit, onGoHome } = props;
  const door = content.doors.find((d) => d.key === doorKey);
  const exhibits = content.exhibits[doorKey];

  return (
    <section aria-label="Section Gallery">
      <div className="sectionHead">
        <div className="sectionHeadContent">
          <div className="breadcrumb">Hall → {door?.title}</div>
          <div className="sectionTitle">{door?.title}</div>
          <div className="sectionThesis">{door?.thesis}</div>
        </div>

        {onGoHome ? (
          <div className="sectionHeadActions">
            <button className="navBtn" type="button" onClick={onGoHome}>
              Home
            </button>
          </div>
        ) : null}
      </div>

      <div className="gallery">
        {exhibits.map((e) => (
          <ExhibitCard key={e.id} exhibit={e} layoutId={`exhibit-${e.id}`} onOpen={() => onOpenExhibit(e.id)} />
        ))}
      </div>
    </section>
  );
}
