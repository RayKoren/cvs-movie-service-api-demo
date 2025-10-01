export function buildWhereClause<T extends object>(where?: Partial<T>, like?: Record<string, string>): { clause: string; params: any[] } {
  const params: any[] = [];
  const parts: string[] = [];

  if (where) {
    const conditions = Object.entries(where)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        params.push(value);
        return `${key} = ?`;
      });
    parts.push(...conditions);
  }

  if (like) {
    const likeConds = Object.entries(like)
      .filter(([_, value]) => typeof value === 'string' && value.length > 0)
      .map(([key, value]) => {
        params.push(value);
        return `${key} LIKE ?`;
      });
    parts.push(...likeConds);
  }

  if (parts.length === 0) return { clause: '', params: [] };
  return { clause: `WHERE ${parts.join(' AND ')}`, params };
}

export function buildOrderClause(order?: Record<string, 'asc'|'desc'>): string {
  if (!order) return '';
  const orderParts = Object.entries(order).map(([key, direction]) => `${key} ${direction.toUpperCase()}`);
  if (orderParts.length === 0) return '';
  return `ORDER BY ${orderParts.join(', ')}`;
}


