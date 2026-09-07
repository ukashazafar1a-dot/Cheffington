export function formatChefReviewCount(count: number): string {
  const safe = Math.max(0, Math.floor(Number(count) || 0));
  if (safe === 0) return "No reviews yet";
  if (safe === 1) return "1 review";
  return `${safe.toLocaleString()} reviews`;
}
