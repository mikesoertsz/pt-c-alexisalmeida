"use client";

import { useId, type KeyboardEvent, type ReactNode } from "react";
import { Sun, Moon } from "lucide-react";
import { useArtistStyle } from "@/app/components/ArtistStyleProvider";

interface StyleSwitcherLabels {
  fineLine: string;
  blackwork: string;
}

interface StyleSwitcherProps {
  labels: StyleSwitcherLabels;
  className?: string;
}

export default function StyleSwitcher({ labels, className }: StyleSwitcherProps) {
  const id = useId();
  const { style, setStyle } = useArtistStyle();

  function onKeyDown(ev: KeyboardEvent<HTMLDivElement>) {
    if (ev.key === "ArrowLeft") {
      ev.preventDefault();
      setStyle("fine-line");
    } else if (ev.key === "ArrowRight") {
      ev.preventDefault();
      setStyle("blackwork");
    }
  }

  return (
    <div
      className={`flex border border-border/30 p-0.5 ${className ?? ""}`}
      role="tablist"
      aria-label={`${labels.fineLine} / ${labels.blackwork}`}
      onKeyDown={onKeyDown}
    >
      <StyleTab
        id={`${id}-fine-line`}
        selected={style === "fine-line"}
        onSelect={() => setStyle("fine-line")}
        icon={<Sun className="size-3.5 shrink-0 opacity-70" aria-hidden />}
        label={labels.fineLine}
      />
      <StyleTab
        id={`${id}-blackwork`}
        selected={style === "blackwork"}
        onSelect={() => setStyle("blackwork")}
        icon={<Moon className="size-3.5 shrink-0 opacity-70" aria-hidden />}
        label={labels.blackwork}
      />
    </div>
  );
}

function StyleTab(props: {
  id: string;
  selected: boolean;
  onSelect: () => void;
  icon: ReactNode;
  label: string;
}) {
  const { id, selected, onSelect, icon, label } = props;
  return (
    <button
      type="button"
      role="tab"
      id={id}
      tabIndex={selected ? 0 : -1}
      aria-selected={selected}
      onClick={onSelect}
      className={[
        "inline-flex min-h-9 cursor-pointer items-center justify-center gap-1.5 px-2.5 text-[0.68rem] font-sans font-medium uppercase tracking-widest transition-colors sm:px-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50 motion-reduce:transition-none",
        selected
          ? "bg-accent text-on-accent"
          : "text-fg-muted hover:text-ink",
      ].join(" ")}
    >
      {icon}
      <span className="max-w-22 truncate sm:max-w-none">{label}</span>
    </button>
  );
}
