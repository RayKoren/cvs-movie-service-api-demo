import { buildWhereClause, buildOrderClause } from '../../helpers/sql_helpers';

describe('SQL Helpers Unit Tests', () => {
  describe('buildWhereClause', () => {
    it('should build WHERE clause with single exact match', () => {
      const where = { id: 1 };
      const result = buildWhereClause(where);
      
      expect(result.clause).toBe('WHERE id = ?');
      expect(result.params).toEqual([1]);
    });

    it('should build WHERE clause with multiple exact matches', () => {
      const where = { id: 1, name: 'Test', status: 'active' };
      const result = buildWhereClause(where);
      
      expect(result.clause).toBe('WHERE id = ? AND name = ? AND status = ?');
      expect(result.params).toEqual([1, 'Test', 'active']);
    });

    it('should build WHERE clause with single LIKE condition', () => {
      const like = { title: '%Test%' };
      const result = buildWhereClause(undefined, like);
      
      expect(result.clause).toBe('WHERE title LIKE ?');
      expect(result.params).toEqual(['%Test%']);
    });

    it('should build WHERE clause with multiple LIKE conditions', () => {
      const like = { title: '%Test%', genre: '%Action%', description: '%Good%' };
      const result = buildWhereClause(undefined, like);
      
      expect(result.clause).toBe('WHERE title LIKE ? AND genre LIKE ? AND description LIKE ?');
      expect(result.params).toEqual(['%Test%', '%Action%', '%Good%']);
    });

    it('should combine exact and LIKE conditions', () => {
      const where = { status: 'active', year: 2023 };
      const like = { title: '%Test%', genre: '%Action%' };
      const result = buildWhereClause(where, like);
      
      expect(result.clause).toBe('WHERE status = ? AND year = ? AND title LIKE ? AND genre LIKE ?');
      expect(result.params).toEqual(['active', 2023, '%Test%', '%Action%']);
    });

    it('should handle empty where object', () => {
      const result = buildWhereClause({});
      expect(result.clause).toBe('');
      expect(result.params).toEqual([]);
    });

    it('should handle empty like object', () => {
      const result = buildWhereClause(undefined, {});
      expect(result.clause).toBe('');
      expect(result.params).toEqual([]);
    });

    it('should handle both empty objects', () => {
      const result = buildWhereClause({}, {});
      expect(result.clause).toBe('');
      expect(result.params).toEqual([]);
    });

    it('should filter out null values from where', () => {
      const where = { id: 1, name: null, status: 'active', description: null };
      const result = buildWhereClause(where);
      
      expect(result.clause).toBe('WHERE id = ? AND status = ?');
      expect(result.params).toEqual([1, 'active']);
    });

    it('should filter out undefined values from where', () => {
      const where = { id: 1, name: undefined, status: 'active', description: undefined };
      const result = buildWhereClause(where);
      
      expect(result.clause).toBe('WHERE id = ? AND status = ?');
      expect(result.params).toEqual([1, 'active']);
    });

    it('should filter out empty string values from like', () => {
      const like = { title: '%Test%', genre: '', description: '%Good%', category: '' };
      const result = buildWhereClause(undefined, like);
      
      expect(result.clause).toBe('WHERE title LIKE ? AND description LIKE ?');
      expect(result.params).toEqual(['%Test%', '%Good%']);
    });

    it('should handle all null/undefined values in where', () => {
      const where = { id: null, name: undefined, status: null };
      const result = buildWhereClause(where);
      
      expect(result.clause).toBe('');
      expect(result.params).toEqual([]);
    });

    it('should handle all empty strings in like', () => {
      const like = { title: '', genre: '', description: '' };
      const result = buildWhereClause(undefined, like);
      
      expect(result.clause).toBe('');
      expect(result.params).toEqual([]);
    });

    it('should handle mixed data types in where', () => {
      const where = { 
        id: 1, 
        name: 'Test', 
        active: true, 
        score: 4.5, 
        tags: ['tag1', 'tag2'],
        metadata: { key: 'value' }
      };
      const result = buildWhereClause(where);
      
      expect(result.clause).toBe('WHERE id = ? AND name = ? AND active = ? AND score = ? AND tags = ? AND metadata = ?');
      expect(result.params).toEqual([1, 'Test', true, 4.5, ['tag1', 'tag2'], { key: 'value' }]);
    });

    it('should handle special characters in LIKE patterns', () => {
      const like = { 
        title: '%Test%', 
        description: '%Special_Chars%', 
        content: '%With%Percent%' 
      };
      const result = buildWhereClause(undefined, like);
      
      expect(result.clause).toBe('WHERE title LIKE ? AND description LIKE ? AND content LIKE ?');
      expect(result.params).toEqual(['%Test%', '%Special_Chars%', '%With%Percent%']);
    });

    it('should handle zero values in where', () => {
      const where = { id: 0, count: 0, active: false };
      const result = buildWhereClause(where);
      
      expect(result.clause).toBe('WHERE id = ? AND count = ? AND active = ?');
      expect(result.params).toEqual([0, 0, false]);
    });
  });

  describe('buildOrderClause', () => {
    it('should build ORDER BY clause with single field ascending', () => {
      const order = { title: 'asc' as const };
      const result = buildOrderClause(order);
      
      expect(result).toBe('ORDER BY title ASC');
    });

    it('should build ORDER BY clause with single field descending', () => {
      const order = { title: 'desc' as const };
      const result = buildOrderClause(order);
      
      expect(result).toBe('ORDER BY title DESC');
    });

    it('should build ORDER BY clause with multiple fields', () => {
      const order = { 
        title: 'asc' as const, 
        year: 'desc' as const, 
        rating: 'asc' as const 
      };
      const result = buildOrderClause(order);
      
      expect(result).toBe('ORDER BY title ASC, year DESC, rating ASC');
    });

    it('should handle empty order object', () => {
      const result = buildOrderClause({});
      expect(result).toBe('');
    });

    it('should handle undefined order', () => {
      const result = buildOrderClause(undefined);
      expect(result).toBe('');
    });

    it('should handle null order', () => {
      const result = buildOrderClause(null as any);
      expect(result).toBe('');
    });

    it('should handle mixed case directions', () => {
      const order = { 
        title: 'ASC' as any, 
        year: 'DESC' as any, 
        rating: 'asc' as const 
      };
      const result = buildOrderClause(order);
      
      expect(result).toBe('ORDER BY title ASC, year DESC, rating ASC');
    });

    it('should handle invalid direction values', () => {
      const order = { 
        title: 'invalid' as any, 
        year: 'desc' as const 
      };
      const result = buildOrderClause(order);
      
      expect(result).toBe('ORDER BY title INVALID, year DESC');
    });

    it('should handle special characters in field names', () => {
      const order = { 
        'user_name': 'asc' as const, 
        'created_at': 'desc' as const 
      };
      const result = buildOrderClause(order);
      
      expect(result).toBe('ORDER BY user_name ASC, created_at DESC');
    });

    it('should handle numeric field names', () => {
      const order = { 
        '1': 'asc' as const, 
        '2': 'desc' as const 
      };
      const result = buildOrderClause(order);
      
      expect(result).toBe('ORDER BY 1 ASC, 2 DESC');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle very long field names', () => {
      const longFieldName = 'a'.repeat(1000);
      const where = { [longFieldName]: 'test' };
      const result = buildWhereClause(where);
      
      expect(result.clause).toBe(`WHERE ${longFieldName} = ?`);
      expect(result.params).toEqual(['test']);
    });

    it('should handle very long values', () => {
      const longValue = 'a'.repeat(10000);
      const where = { description: longValue };
      const result = buildWhereClause(where);
      
      expect(result.clause).toBe('WHERE description = ?');
      expect(result.params).toEqual([longValue]);
    });

    it('should handle circular references in objects', () => {
      const circularObj: any = { name: 'test' };
      circularObj.self = circularObj;
      
      const where = { metadata: circularObj };
      const result = buildWhereClause(where);
      
      expect(result.clause).toBe('WHERE metadata = ?');
      expect(result.params).toEqual([circularObj]);
    });

    it('should handle functions as values', () => {
      const func = () => 'test';
      const where = { callback: func };
      const result = buildWhereClause(where);
      
      expect(result.clause).toBe('WHERE callback = ?');
      expect(result.params).toEqual([func]);
    });

    it('should handle symbols as values', () => {
      const sym = Symbol('test');
      const where = { key: sym };
      const result = buildWhereClause(where);
      
      expect(result.clause).toBe('WHERE key = ?');
      expect(result.params).toEqual([sym]);
    });
  });
});
