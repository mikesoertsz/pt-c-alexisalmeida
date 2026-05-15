"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import type { ContentSchema } from "@/app/content";
import type { Locale } from "@/app/lib/locale";
import { formatEurAmount, formatFromPriceTemplate } from "@/app/lib/format-money";
import { useStyleMedia } from "@/app/components/ArtistStyleProvider";

type PricingSlice = ContentSchema["pricing"];

interface PricingEstimatorProps {
  slice: PricingSlice;
  consultationButtonLabel: string;
  locale: Locale;
}

const RANGE_MIN = 0;

function visualIndexFromSelection(
  sizeIndex: number,
  complexityIndex: number,
  styleIndex: number,
  coverUp: boolean,
  visualCount: number,
): number {
  if (visualCount <= 1) return 0;
  const score =
    sizeIndex * 9 + complexityIndex * 3 + styleIndex + (coverUp ? 2 : 0);
  const maxScore = 2 * 9 + 2 * 3 + 2 + 2;
  return Math.min(
    visualCount - 1,
    Math.round((score / maxScore) * (visualCount - 1)),
  );
}

function TierRangeRow(props: {
  label: string;
  id: string;
  max: number;
  value: number;
  onChange: (index: number) => void;
  optionLabels: readonly string[];
  valueText: string;
}) {
  const { label, id, max, value, onChange, optionLabels, valueText } = props;
  return (
    <div className="mb-6 last:mb-0">
      <label htmlFor={id} className="text-xs font-sans font-medium text-ink/80 mb-2.5 block tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={RANGE_MIN}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 accent-accent cursor-pointer"
        aria-valuemin={RANGE_MIN}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueText}
      />
      <div
        className="flex justify-between text-[0.6rem] text-fg-muted mt-2 gap-2 font-sans uppercase tracking-widest"
        aria-hidden="true"
      >
        {optionLabels.map((labelText) => (
          <span key={labelText} className="text-center min-w-0 flex-1 truncate">
            {labelText}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PricingEstimator({
  slice,
  consultationButtonLabel,
  locale,
}: PricingEstimatorProps) {
  const { calculator, tiers, notes } = slice;
  const visuals = useStyleMedia(calculator.visuals);
  const maxTier = tiers.length - 1;
  const maxComplexity = calculator.complexityLevels.length - 1;
  const maxStyle = calculator.styleLevels.length - 1;

  const sizeSliderId = useId();
  const complexitySliderId = useId();
  const styleSliderId = useId();
  const coverUpId = useId();
  const outputId = useId();

  const [sizeIndex, setSizeIndex] = useState(0);
  const [complexityIndex, setComplexityIndex] = useState(0);
  const [styleIndex, setStyleIndex] = useState(0);
  const [coverUp, setCoverUp] = useState(false);

  const tier = tiers[sizeIndex] ?? tiers[0];
  const complexity = calculator.complexityLevels[complexityIndex] ?? calculator.complexityLevels[0];
  const style = calculator.styleLevels[styleIndex] ?? calculator.styleLevels[0];

  const estimatedEuros = useMemo(() => {
    const base = tier.fromEuros;
    const raw = Math.round(
      base *
        complexity.factor *
        style.factor *
        (coverUp ? calculator.coverUpFactor : 1),
    );
    return Math.max(raw, base);
  }, [
    tier.fromEuros,
    complexity.factor,
    style.factor,
    coverUp,
    calculator.coverUpFactor,
  ]);

  const formattedAmount = formatEurAmount(locale, estimatedEuros);
  const priceDisplay = formatFromPriceTemplate(calculator.priceFromTemplate, formattedAmount);

  const visualIndex = visualIndexFromSelection(
    sizeIndex,
    complexityIndex,
    styleIndex,
    coverUp,
    visuals.length,
  );
  const visual = visuals[visualIndex] ?? visuals[0];

  const sizeValueText = `${tier.name}, ${tier.size}`;
  const complexityValueText = `${complexity.name}. ${complexity.blurb}`;
  const styleValueText = `${style.name}. ${style.blurb}`;

  return (
    <div className="grid w-full grid-cols-1 items-stretch gap-0 lg:grid-cols-2">
      <div className="relative min-h-[min(75vw,22rem)] sm:min-h-104 lg:min-h-[min(36rem,75vh)] lg:border-r lg:border-border/25">
        <Image
          key={visual.src}
          src={visual.src}
          alt={visual.alt}
          fill
          className="object-cover transition-opacity duration-500 motion-reduce:transition-none"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority={false}
        />
      </div>

      <div className="flex min-h-0 flex-col justify-center bg-surface/70 px-6 py-12 sm:px-10 sm:py-14 lg:min-h-[min(36rem,75vh)] lg:px-14 lg:py-16 xl:px-20">
        <div className="w-full">
          <div className="flex flex-col p-6 sm:p-8 bg-card-alt border border-border/25">
            <TierRangeRow
              label={calculator.sizeLabel}
              id={sizeSliderId}
              max={maxTier}
              value={sizeIndex}
              onChange={setSizeIndex}
              optionLabels={tiers.map((t) => t.name)}
              valueText={sizeValueText}
            />

            <TierRangeRow
              label={calculator.complexityLabel}
              id={complexitySliderId}
              max={maxComplexity}
              value={complexityIndex}
              onChange={setComplexityIndex}
              optionLabels={calculator.complexityLevels.map((l) => l.name)}
              valueText={complexityValueText}
            />

            <TierRangeRow
              label={calculator.styleLabel}
              id={styleSliderId}
              max={maxStyle}
              value={styleIndex}
              onChange={setStyleIndex}
              optionLabels={calculator.styleLevels.map((l) => l.name)}
              valueText={styleValueText}
            />

            <div className="mb-6 flex items-start gap-3 border border-border/20 bg-surface/60 px-3 py-3 sm:px-4">
              <input
                id={coverUpId}
                type="checkbox"
                checked={coverUp}
                onChange={(e) => setCoverUp(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-accent cursor-pointer border-border/40"
              />
              <label htmlFor={coverUpId} className="cursor-pointer text-sm leading-snug text-ink font-sans">
                <span className="font-medium text-ink">{calculator.coverUp.label}</span>
                <span className="mt-1 block text-xs text-fg-muted">{calculator.coverUp.hint}</span>
              </label>
            </div>

            <div
              id={outputId}
              className="mt-2 pt-6 border-t border-border/25"
              role="region"
              aria-label="Selected estimate"
              aria-live="polite"
              aria-atomic="true"
            >
              <dl className="mb-4 space-y-3 text-sm">
                <div className="flex flex-col gap-0.5 border-b border-border/20 pb-3">
                  <dt className="text-[0.6rem] uppercase tracking-[0.18em] text-fg-muted font-sans">
                    {calculator.sizeLabel}
                  </dt>
                  <dd className="font-sans text-lg font-light text-ink">{tier.name}</dd>
                  <dd className="text-xs text-fg-muted font-sans">{tier.size}</dd>
                </div>
                <div className="flex flex-col gap-0.5 border-b border-border/20 pb-3">
                  <dt className="text-[0.6rem] uppercase tracking-[0.18em] text-fg-muted font-sans">
                    {calculator.complexityLabel}
                  </dt>
                  <dd className="text-sm text-ink/85 leading-relaxed font-sans">{complexity.blurb}</dd>
                </div>
                <div className="flex flex-col gap-0.5 pb-1">
                  <dt className="text-[0.6rem] uppercase tracking-[0.18em] text-fg-muted font-sans">
                    {calculator.styleLabel}
                  </dt>
                  <dd className="text-sm text-ink/85 leading-relaxed font-sans">{style.blurb}</dd>
                </div>
              </dl>

              <p className="font-mono text-2xl font-light text-accent tabular-nums mb-3 tracking-[-0.01em]">
                {priceDisplay}
              </p>

              <p className="text-sm text-ink/85 leading-relaxed mb-4 font-sans">{tier.description}</p>

              <ul className="space-y-2 border-t border-border/20 pt-4">
                {tier.examples.map((example) => (
                  <li key={example} className="flex items-start gap-2.5 text-sm text-ink font-sans">
                    <span className="text-accent/50 mt-0.5 shrink-0 text-base leading-none" aria-hidden>—</span>
                    {example}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-fg-muted mt-6 leading-relaxed font-sans">{calculator.helper}</p>
          </div>
        </div>

        <div className="mt-10 w-full max-w-xl">
          <ul className="space-y-3 text-left">
            {notes.map((note) => (
              <li
                key={note}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-fg-muted font-sans"
              >
                <span className="text-accent/50 mt-0.5 shrink-0" aria-hidden="true">—</span>
                {note}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="#booking"
              className="inline-flex items-center justify-center px-8 py-3.5 text-[0.7rem] font-sans font-medium uppercase tracking-[0.16em] text-on-accent bg-accent hover:bg-accent/85 transition-colors min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/80 motion-reduce:transition-none"
            >
              {consultationButtonLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
