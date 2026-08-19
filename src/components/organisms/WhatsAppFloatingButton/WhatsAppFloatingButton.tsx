import { FaWhatsapp } from "react-icons/fa";

interface Props {
  href: string;
  label: string;
  ariaLabel: string;
}

/**
 * Floating WhatsApp CTA, bottom-right. Keeps WhatsApp's own green rather than
 * the host brand colour — it is the most recognisable "message me now"
 * affordance and must not read as just another branded button. Expands to a
 * labelled pill on pointer devices.
 */
export default function WhatsAppFloatingButton({ href, label, ariaLabel }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={[
        "group fixed z-50 flex h-14 items-center gap-0 overflow-hidden rounded-full",
        "bg-[#25D366] px-4 text-white shadow-lg shadow-[rgba(13,15,17,0.25)]",
        "transition-[gap,box-shadow,transform] duration-300 ease-out",
        "hover:gap-2.5 hover:shadow-xl active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed5024]",
        "bottom-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]",
        "right-[max(1.5rem,env(safe-area-inset-right,1.5rem))]",
      ].join(" ")}
    >
      <FaWhatsapp className="size-7 shrink-0" aria-hidden />
      {/* Unfurls on hover; collapsed to zero width so the resting state is a
          clean circle. Hidden on touch, where hover never fires. */}
      <span className="font-[family-name:var(--font-oswald),system-ui,sans-serif] hidden max-w-0 whitespace-nowrap text-sm uppercase tracking-[0.14em] opacity-0 transition-[max-width,opacity] duration-300 ease-out group-hover:max-w-52 group-hover:opacity-100 sm:inline">
        {label}
      </span>
    </a>
  );
}
