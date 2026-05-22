import type { ContentSection } from "@/types/restaurant";
import ContentSectionBlock from "./content-section-block";

export default function RestaurantContentSections({
  sections,
}: {
  sections?: ContentSection[];
}) {
  const sorted = [...(sections ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  if (sorted.length === 0) {
    return (
      <p className="text-gray-600 bg-white border border-gray-200 rounded-lg p-6">
        No additional information yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {sorted.map((section, index) => (
        <ContentSectionBlock
          key={section._id ?? `section-${index}`}
          section={section}
        />
      ))}
    </div>
  );
}
