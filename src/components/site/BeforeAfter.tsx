import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Placeholder smile-transformation gallery.
 *
 * Swap `SmileGraphic` for real patient photography once you have signed
 * consent forms — the layout takes 4:3 images without changes.
 */
const CASES = [
  {
    title: "Chipped front teeth",
    treatment: "Composite bonding, one visit",
    before: { shade: "#dfd3bd", gap: true },
    after: { shade: "#fbfcfd", gap: false },
  },
  {
    title: "Missing lower molar",
    treatment: "Single dental implant",
    before: { shade: "#e5dcc9", gap: true },
    after: { shade: "#f8fafc", gap: false },
  },
  {
    title: "Crowded upper arch",
    treatment: "Clear aligners, 11 months",
    before: { shade: "#e8e0cf", gap: false, crowded: true },
    after: { shade: "#fafcfe", gap: false },
  },
];

type SmileProps = {
  shade: string;
  gap?: boolean;
  crowded?: boolean;
};

function SmileGraphic({ shade, gap = false, crowded = false }: SmileProps) {
  const teeth = Array.from({ length: 8 }, (_, index) => index);

  return (
    <svg
      viewBox="0 0 240 180"
      className="h-full w-full"
      role="img"
      aria-label="Illustration of a smile"
    >
      <rect width="240" height="180" fill="var(--color-ink-50)" />
      <path
        d="M40 66c22-16 52-24 80-24s58 8 80 24c-6 48-28 74-56 82-8 2.4-16 3.6-24 3.6s-16-1.2-24-3.6c-28-8-50-34-56-82z"
        fill="#f2d7d7"
      />
      {teeth.map((index) => {
        const width = crowded ? 19 : 20;
        const x = 52 + index * 17.5 + (crowded && index % 2 === 0 ? 2.5 : 0);
        const height = crowded && index % 3 === 0 ? 34 : 40;
        const hidden = gap && index === 5;

        return hidden ? null : (
          <rect
            key={index}
            x={x}
            y={crowded && index % 3 === 0 ? 74 : 70}
            width={width - 3}
            height={height}
            rx="6"
            fill={shade}
            stroke="rgba(13,31,45,0.08)"
          />
        );
      })}
      <path
        d="M40 66c22-16 52-24 80-24s58 8 80 24"
        fill="none"
        stroke="rgba(13,31,45,0.12)"
        strokeWidth="2"
      />
    </svg>
  );
}

export function BeforeAfter() {
  return (
    <section className="py-20">
      <Container width="wide">
        <SectionHeading
          eyebrow="Smile gallery"
          title="Results from our own chairs"
          description="Illustrative cases from treatments we carry out every week. Ask to see the full photo gallery at your consultation."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {CASES.map((item) => (
            <figure
              key={item.title}
              className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-100"
            >
              <div className="grid grid-cols-2 divide-x divide-white">
                <div className="relative aspect-[4/3]">
                  <SmileGraphic {...item.before} />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-700">
                    Before
                  </span>
                </div>
                <div className="relative aspect-[4/3]">
                  <SmileGraphic {...item.after} />
                  <span className="absolute left-3 top-3 rounded-full bg-mint-600 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-white">
                    After
                  </span>
                </div>
              </div>
              <figcaption className="p-5">
                <p className="font-semibold text-ink-900">{item.title}</p>
                <p className="mt-1 text-sm text-ink-600">{item.treatment}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-ink-500">
          Individual results vary. Every treatment plan is assessed and quoted
          personally.
        </p>
      </Container>
    </section>
  );
}
