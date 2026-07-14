type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** JSON-LD構造化データをページに埋め込むコンポーネント */
export default function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
