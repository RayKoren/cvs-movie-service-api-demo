import { buildWhereClause, buildOrderClause } from '../../helpers/sql_helpers';

describe('SQL Helpers', () => {
  describe('buildWhereClause', () => {
    test('should build WHERE clause with exact matches', () => {
      const where = { title: 'Test Movie', year: 2023 };
      const result = buildWhereClause(where);
      
      expect(result.clause).toBe('WHERE title = ? AND year = ?');
      expect(result.params).toEqual(['Test Movie', 2023]);
    });

    test('should build WHERE clause with LIKE conditions', () => {
      const like = { title: '%Test%', genre: '%Action%' };
      const result = buildWhereClause(undefined, like);
      
      expect(result.clause).toBe('WHERE title LIKE ? AND genre LIKE ?');
      expect(result.params).toEqual(['%Test%', '%Action%']);
    });

    test('should build WHERE clause with both exact and LIKE conditions', () => {
      const where = { status: 'Released' };
      const like = { title: '%Test%' };
      const result = buildWhereClause(where, like);
      
      expect(result.clause).toBe('WHERE status = ? AND title LIKE ?');
      expect(result.params).toEqual(['Released', '%Test%']);
    });

    test('should handle empty conditions', () => {
      const result = buildWhereClause();
      expect(result.clause).toBe('');
      expect(result.params).toEqual([]);
    });

    test('should filter out null/undefined values', () => {
      const where = { title: 'Test', year: null, status: undefined };
      const result = buildWhereClause(where);
      
      expect(result.clause).toBe('WHERE title = ?');
      expect(result.params).toEqual(['Test']);
    });

    test('should filter out empty LIKE values', () => {
      const like = { title: '%Test%', genre: '' };
      const result = buildWhereClause(undefined, like);
      
      expect(result.clause).toBe('WHERE title LIKE ?');
      expect(result.params).toEqual(['%Test%']);
    });
  });

  describe('buildOrderClause', () => {
    test('should build ORDER BY clause with single field', () => {
      const order = { title: 'asc' as const };
      const result = buildOrderClause(order);
      
      expect(result).toBe('ORDER BY title ASC');
    });

    test('should build ORDER BY clause with multiple fields', () => {
      const order = { title: 'asc' as const, year: 'desc' as const };
      const result = buildOrderClause(order);
      
      expect(result).toBe('ORDER BY title ASC, year DESC');
    });

    test('should handle empty order object', () => {
      const result = buildOrderClause({});
      expect(result).toBe('');
    });

    test('should handle undefined order', () => {
      const result = buildOrderClause();
      expect(result).toBe('');
    });
  });
});
