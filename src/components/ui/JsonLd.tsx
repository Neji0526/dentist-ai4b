type Props = {
  data: unknown;
};

/**
 * Structured data. JSON.stringify output is escaped for the one sequence that
 * can break out of a script element.
 */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
