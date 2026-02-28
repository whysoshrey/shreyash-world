import type { Content, DoorKey } from "../lib/types";
import { LightboxDoor } from "./LightboxDoor";

export function DoorHall(props: { content: Content; onOpenDoor: (key: DoorKey) => void }) {
  const { content, onOpenDoor } = props;
  return (
    <section className="hall" aria-label="Door Hall">
      {content.doors.map((d) => (
        <LightboxDoor key={d.key} door={d} count={content.exhibits[d.key].length} onOpen={() => onOpenDoor(d.key)} />
      ))}
    </section>
  );
}
