import type { ContentSection } from "@/types/restaurant";

export default function ContentSectionBlock({ section }: { section: ContentSection }) {
  const images = (section.images ?? []).filter(Boolean);

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
      {section.body && (
        <p className="text-gray-700 whitespace-pre-wrap mb-6">{section.body}</p>
      )}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${url}-${i}`}
              src={url}
              alt={`${section.heading} ${i + 1}`}
              className="w-full rounded-lg object-cover max-h-80"
            />
          ))}
        </div>
      )}
    </article>
  );
}
