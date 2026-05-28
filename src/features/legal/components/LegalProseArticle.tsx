import type { LegalBlock, LegalDocument } from "../types";

function renderBlock(block: LegalBlock, key: string) {
  if (block.type === "p") {
    return (
      <p key={key} className="font-body text-sm leading-relaxed text-brand-black/70 md:text-base">
        {block.text}
      </p>
    );
  }
  return (
    <ul
      key={key}
      className="list-disc space-y-2 pl-5 font-body text-sm leading-relaxed text-brand-black/70 md:text-base"
    >
      {block.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

interface LegalProseArticleProps {
  document: LegalDocument;
}

export function LegalProseArticle({ document: doc }: LegalProseArticleProps) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-6 py-12 md:py-16">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-brand-muted">
          {doc.meta.lastUpdated}
        </p>
        <h1 className="font-display text-3xl font-black uppercase text-brand-black md:text-4xl tracking-tighter">
          {doc.meta.documentTitle}
        </h1>
      </header>

      <div className="space-y-10">
        {doc.sections.map((section) => {
          const HeadingTag = section.level === 3 ? "h3" : "h2";
          return (
            <section key={section.heading} className="space-y-4">
              <HeadingTag
                className={
                  section.level === 3
                    ? "font-display text-lg font-black uppercase text-brand-black tracking-tighter"
                    : "font-display text-xl font-black uppercase text-brand-black md:text-2xl tracking-tighter"
                }
              >
                {section.heading}
              </HeadingTag>
              <div className="space-y-3">
                {section.blocks.map((block, i) =>
                  renderBlock(block, `${section.heading}-${i}`)
                )}
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
