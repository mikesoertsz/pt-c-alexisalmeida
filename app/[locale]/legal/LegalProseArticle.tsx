import type { LegalBlock, LegalDocument } from "./legal-types";

function renderBlock(block: LegalBlock, key: string) {
  if (block.type === "p") {
    return (
      <p key={key} className="text-sm leading-relaxed text-olive md:text-base">
        {block.text}
      </p>
    );
  }
  return (
    <ul
      key={key}
      className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-olive md:text-base"
    >
      {block.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

interface Props {
  document: LegalDocument;
}

export default function LegalProseArticle({ document: doc }: Props) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-12 md:py-16">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/70">
          {doc.meta.lastUpdated}
        </p>
        <h1 className="font-display text-3xl font-light tracking-tight text-ink md:text-4xl">
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
                    ? "font-display text-lg font-medium text-ink"
                    : "font-display text-xl font-medium text-ink md:text-2xl"
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
