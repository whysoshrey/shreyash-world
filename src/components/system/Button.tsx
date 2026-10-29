import type { MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * Button — the single call-to-action component.
 * Variants: primary (solid ink) · secondary (outline) · ghost (quiet outline) · link (underline)
 * States (CSS): default · hover (fill wipes up) · pressed (sinks 1px, 0.98) · focus-visible (accent ring) · disabled
 */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "link" | "cream" | "onblue";

type Common = {
  variant?: ButtonVariant;
  size?: "md" | "sm";
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

type AsLink = Common & { to: string; state?: unknown; href?: never; onClick?: never; disabled?: never };
type AsAnchor = Common & { href: string; to?: never; external?: boolean; onClick?: MouseEventHandler<HTMLAnchorElement>; disabled?: never };
type AsButton = Common & { onClick?: MouseEventHandler<HTMLButtonElement>; to?: never; href?: never; disabled?: boolean; pressed?: boolean };

export function Button(props: AsLink | AsAnchor | AsButton) {
  const { variant = "secondary", size = "md", icon, children, className = "" } = props;
  const cls = `btn btn--${variant}${size === "sm" ? " btn--sm" : ""} ${className}`.trim();
  const inner = (
    <>
      <span className="btn__label">{children}</span>
      {icon ? <span className="btn__icon">{icon}</span> : null}
    </>
  );

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} state={props.state} className={cls}>
        {inner}
      </Link>
    );
  }
  if ("href" in props && props.href) {
    const ext = props.external ?? /^https?:/.test(props.href);
    return (
      <a href={props.href} className={cls} onClick={props.onClick} {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  const b = props as AsButton;
  return (
    <button type="button" className={cls} onClick={b.onClick} disabled={b.disabled} aria-pressed={b.pressed}>
      {inner}
    </button>
  );
}
