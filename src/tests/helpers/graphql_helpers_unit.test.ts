import { formatDollars, formatText } from '../../graphql/helpers/graphql_helpers';

describe('GraphQL Helpers Unit Tests', () => {
  describe('formatDollars', () => {
    it('should format positive integers', () => {
      expect(formatDollars(1000)).toBe('$1,000');
      expect(formatDollars(1000000)).toBe('$1,000,000');
      expect(formatDollars(1234567)).toBe('$1,234,567');
    });

    it('should format negative integers', () => {
      expect(formatDollars(-1000)).toBe('$-1,000');
      expect(formatDollars(-1000000)).toBe('$-1,000,000');
    });

    it('should format zero', () => {
      expect(formatDollars(0)).toBe('$0');
    });

    it('should format positive decimals', () => {
      expect(formatDollars(1000.50)).toBe('$1,000.5');
      expect(formatDollars(1234.56)).toBe('$1,234.56');
      expect(formatDollars(0.99)).toBe('$0.99');
    });

    it('should format negative decimals', () => {
      expect(formatDollars(-1000.50)).toBe('$-1,000.5');
      expect(formatDollars(-1234.56)).toBe('$-1,234.56');
    });

    it('should format string numbers', () => {
      expect(formatDollars('1000')).toBe('$1,000');
      expect(formatDollars('1000000')).toBe('$1,000,000');
      expect(formatDollars('1234.56')).toBe('$1,234.56');
    });

    it('should format negative string numbers', () => {
      expect(formatDollars('-1000')).toBe('$-1,000');
      expect(formatDollars('-1234.56')).toBe('$-1,234.56');
    });

    it('should handle null input', () => {
      expect(formatDollars(null)).toBe(null);
    });

    it('should handle undefined input', () => {
      expect(formatDollars(undefined)).toBe(null);
    });

    it('should handle empty string', () => {
      expect(formatDollars('')).toBe(null);
    });

    it('should handle invalid string input', () => {
      expect(formatDollars('invalid')).toBe(null);
      expect(formatDollars('abc123')).toBe(null);
      expect(formatDollars('12.34.56')).toBe(null);
    });

    it('should handle NaN', () => {
      expect(formatDollars(NaN)).toBe(null);
    });

    it('should handle Infinity', () => {
      expect(formatDollars(Infinity)).toBe('$∞');
      expect(formatDollars(-Infinity)).toBe('$-∞');
    });

    it('should handle very large numbers', () => {
      expect(formatDollars(999999999999)).toBe('$999,999,999,999');
      expect(formatDollars(1000000000000)).toBe('$1,000,000,000,000');
    });

    it('should handle very small numbers', () => {
      expect(formatDollars(0.01)).toBe('$0.01');
      expect(formatDollars(0.001)).toBe('$0.001');
    });

    it('should handle numbers with many decimal places', () => {
      expect(formatDollars(1234.56789)).toBe('$1,234.568');
      expect(formatDollars(1234.123456789)).toBe('$1,234.123');
    });

    it('should handle scientific notation', () => {
      expect(formatDollars(1e6)).toBe('$1,000,000');
      expect(formatDollars(1.5e6)).toBe('$1,500,000');
    });

    it('should handle boolean values', () => {
      expect(formatDollars(true)).toBe('$1');
      expect(formatDollars(false)).toBe(null);
    });

    it('should handle objects', () => {
      expect(formatDollars({})).toBe(null);
      expect(formatDollars({ value: 1000 })).toBe(null);
    });

    it('should handle functions', () => {
      expect(formatDollars(() => 1000)).toBe(null);
    });
  });

  describe('formatText', () => {
    it('should format JSON array of objects with name property', () => {
      const genres = '[{"id": 18, "name": "Drama"}, {"id": 80, "name": "Crime"}]';
      expect(formatText(genres)).toBe('Drama, Crime');
    });

    it('should format JSON array of objects with mixed properties', () => {
      const genres = '[{"id": 1, "name": "Action"}, {"id": 2, "title": "Comedy"}, {"id": 3, "name": "Drama"}]';
      expect(formatText(genres)).toBe('Action, Drama');
    });

    it('should format JSON array of strings', () => {
      const genres = '["Drama", "Crime", "Thriller"]';
      expect(formatText(genres)).toBe('Drama, Crime, Thriller');
    });

    it('should format already parsed array of objects', () => {
      const genres = [{ name: 'Drama' }, { name: 'Crime' }];
      expect(formatText(genres)).toBe('Drama, Crime');
    });

    it('should format already parsed array of strings', () => {
      const genres = ['Drama', 'Crime', 'Thriller'];
      expect(formatText(genres)).toBe('Drama, Crime, Thriller');
    });

    it('should handle single item arrays', () => {
      expect(formatText('["Drama"]')).toBe('Drama');
      expect(formatText('[{"name": "Action"}]')).toBe('Action');
      expect(formatText(['Drama'])).toBe('Drama');
      expect(formatText([{ name: 'Action' }])).toBe('Action');
    });

    it('should handle empty arrays', () => {
      expect(formatText('[]')).toBe(null);
      expect(formatText([])).toBe(null);
    });

    it('should handle null input', () => {
      expect(formatText(null)).toBe(null);
    });

    it('should handle undefined input', () => {
      expect(formatText(undefined)).toBe(null);
    });

    it('should handle empty string', () => {
      expect(formatText('')).toBe(null);
    });

    it('should handle invalid JSON', () => {
      expect(formatText('invalid json')).toBe('invalid json');
      expect(formatText('{"not": "array"}')).toBe(null);
      expect(formatText('not json at all')).toBe('not json at all');
    });

    it('should handle malformed JSON arrays', () => {
      expect(formatText('[{"name": "Drama"')).toBe('[{"name": "Drama"');
      expect(formatText('{"name": "Drama"}]')).toBe('{"name": "Drama"}]');
      expect(formatText('[{"name": "Drama"},]')).toBe('[{"name": "Drama"},]');
    });

    it('should handle objects without name property', () => {
      const genres = '[{"id": 18}, {"id": 80}]';
      expect(formatText(genres)).toBe(null);
    });

    it('should handle mixed valid/invalid objects', () => {
      const genres = '[{"name": "Drama"}, {"id": 80}, {"name": "Crime"}]';
      expect(formatText(genres)).toBe('Drama, Crime');
    });

    it('should handle objects with null name', () => {
      const genres = '[{"name": "Drama"}, {"name": null}, {"name": "Crime"}]';
      expect(formatText(genres)).toBe('Drama, Crime');
    });

    it('should handle objects with undefined name', () => {
      const genres = '[{"name": "Drama"}, {"name": undefined}, {"name": "Crime"}]';
      expect(formatText(genres)).toBe('[{"name": "Drama"}, {"name": undefined}, {"name": "Crime"}]');
    });

    it('should handle objects with empty string name', () => {
      const genres = '[{"name": "Drama"}, {"name": ""}, {"name": "Crime"}]';
      expect(formatText(genres)).toBe('Drama, , Crime');
    });

    it('should handle non-array JSON objects', () => {
      expect(formatText('{"name": "Drama"}')).toBe(null);
      expect(formatText('{"genres": ["Drama", "Crime"]}')).toBe(null);
    });

    it('should handle non-object array elements', () => {
      expect(formatText('[1, 2, 3]')).toBe(null);
      expect(formatText('[true, false]')).toBe(null);
      expect(formatText('[null, undefined]')).toBe('[null, undefined]');
    });

    it('should handle nested arrays', () => {
      expect(formatText('[["Drama"], ["Crime"]]')).toBe(null);
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000);
      const genres = `[{"name": "${longString}"}]`;
      expect(formatText(genres)).toBe(longString);
    });

    it('should handle special characters in names', () => {
      const genres = '[{"name": "Sci-Fi"}, {"name": "Action & Adventure"}]';
      expect(formatText(genres)).toBe('Sci-Fi, Action & Adventure');
    });

    it('should handle unicode characters', () => {
      const genres = '[{"name": "Drama"}, {"name": "Comédie"}]';
      expect(formatText(genres)).toBe('Drama, Comédie');
    });

    it('should handle numbers as names', () => {
      const genres = '[{"name": "2023"}, {"name": "2024"}]';
      expect(formatText(genres)).toBe('2023, 2024');
    });

    it('should handle boolean values as names', () => {
      const genres = '[{"name": true}, {"name": false}]';
      expect(formatText(genres)).toBe(null);
    });

    it('should handle objects as names', () => {
      const genres = '[{"name": {"nested": "object"}}]';
      expect(formatText(genres)).toBe(null);
    });

    it('should handle arrays as names', () => {
      const genres = '[{"name": ["nested", "array"]}]';
      expect(formatText(genres)).toBe(null);
    });

    it('should handle functions as names', () => {
      const genres = '[{"name": () => "function"}]';
      expect(formatText(genres)).toBe('[{"name": () => "function"}]');
    });

    it('should handle circular references', () => {
      const circular: any = { name: 'Drama' };
      circular.self = circular;
      const genres = [circular, { name: 'Crime' }];
      expect(formatText(genres)).toBe('Drama, Crime');
    });
  });
});
