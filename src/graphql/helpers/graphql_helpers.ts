export function formatDollars(value: any): string | null {
  const num = typeof value === 'number' ? value : (value ? Number(value) : null);
  if (num === null || Number.isNaN(num)) return null;
  return `$${num.toLocaleString('en-US')}`;
}

export function formatText(genres: any): string | null {
  if (!genres) return null;
  try {
    const parsed = typeof genres === 'string' ? JSON.parse(genres) : genres;
    if (Array.isArray(parsed)) {
      const names = parsed
        .map((g: any) => (typeof g === 'string' ? g : g?.name))
        .filter((n: any) => typeof n === 'string');
      return names.length ? names.join(', ') : null;
    }
    return null;
  } catch {
    return typeof genres === 'string' ? genres : null;
  }
}

