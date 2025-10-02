const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export function formatDollars(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'boolean') return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  const num = typeof value === 'number' ? value : Number(value as any);
  if (!Number.isFinite(num)) return null;
  return usdFormatter.format(num);
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

