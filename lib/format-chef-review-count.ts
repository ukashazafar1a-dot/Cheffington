export function formatChefReviewCount(count: number): string {
  const safe = Math.max(0, Math.floor(Number(count) || 0));
  if (safe === 0) return "No chef reviews yet";
  if (safe === 1) return "1 chef review";
  return `${safe.toLocaleString()} chef reviews`;
}
