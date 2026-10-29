/**
 * Line icon set — 24px grid, 1.4px stroke, round joins, currentColor.
 * Part of the design system: one visual weight for every icon.
 */
export type IconName =
  | "ops"
  | "merch"
  | "brand"
  | "cred"
  | "doc"
  | "folder"
  | "cube"
  | "image"
  | "play"
  | "globe"
  | "plus"
  | "chevron"
  | "check";

const PATHS: Record<IconName, string> = {
  // gear: operational systems
  ops: "M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z M12 2.8v2.6 M12 18.6v2.6 M2.8 12h2.6 M18.6 12h2.6 M5.5 5.5l1.8 1.8 M16.7 16.7l1.8 1.8 M5.5 18.5l1.8-1.8 M16.7 7.3l1.8-1.8",
  // hanger: merchandising
  merch: "M10 6.5a2 2 0 1 1 2.6 1.9c-.4.1-.6.5-.6.9V11 M12 11 2.8 17.6c-.6.4-.3 1.4.4 1.4h17.6c.7 0 1-1 .4-1.4z",
  // gem: brand & product
  brand: "M7 4h10l4 5-9 11L3 9z M3 9h18 M9.5 4 8 9l4 11 4-11-1.5-5",
  // seal: credentials
  cred: "M12 3.2a5.6 5.6 0 1 0 0 11.2 5.6 5.6 0 0 0 0-11.2z M8.7 13.4 7.4 20.8l4.6-2.6 4.6 2.6-1.3-7.4",
  doc: "M6 3h8.5L19 7.5V21H6z M14 3v5h5 M9 12.5h7 M9 16h7",
  folder: "M3 6.5h6.2l2 2.2H21V19H3z",
  cube: "M12 3l8 4.5v9L12 21l-8-4.5v-9z M4 7.5l8 4.5 8-4.5 M12 12v9",
  image: "M3.5 5h17v14h-17z M3.5 16l5-5 4 4 2.5-2.5 5.5 5 M15.5 8.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z",
  play: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M10 8.5v7l6-3.5z",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c2.8 2.6 2.8 15.4 0 18 M12 3c-2.8 2.6-2.8 15.4 0 18",
  plus: "M12 5v14 M5 12h14",
  chevron: "M9 6l6 6-6 6",
  check: "M5 12.5l4.2 4L19 7",
};

export function Icon(props: { name: IconName; size?: number; className?: string; title?: string }) {
  const { name, size = 20, className, title } = props;
  return (
    <svg
      className={`icon ${className ?? ""}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export const DOOR_ICON = { ops: "ops", merch: "merch", brand: "brand", cred: "cred" } as const;
