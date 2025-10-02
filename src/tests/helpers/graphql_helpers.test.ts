import { formatDollars, formatText } from '../../graphql/helpers/graphql_helpers';

describe('GraphQL Helpers', () => {
  describe('formatDollars', () => {
    test('should format number as currency', () => {
      expect(formatDollars(1000000)).toBe('$1,000,000');
      expect(formatDollars(500)).toBe('$500');
      expect(formatDollars(0)).toBe('$0');
    });

    test('should format string number as currency', () => {
      expect(formatDollars('1000000')).toBe('$1,000,000');
      expect(formatDollars('500')).toBe('$500');
    });

    test('should handle null and undefined', () => {
      expect(formatDollars(null)).toBe(null);
      expect(formatDollars(undefined)).toBe(null);
    });

    test('should handle invalid values', () => {
      expect(formatDollars('invalid')).toBe(null);
      expect(formatDollars(NaN)).toBe(null);
      expect(formatDollars('')).toBe(null);
    });

    test('should handle decimal numbers', () => {
      expect(formatDollars(1234.56)).toBe('$1,234.56');
    });
  });

  describe('formatText', () => {
    test('should format JSON array of objects', () => {
      const genres = '[{"id": 18, "name": "Drama"}, {"id": 80, "name": "Crime"}]';
      expect(formatText(genres)).toBe('Drama, Crime');
    });

    test('should format JSON array of strings', () => {
      const genres = '["Drama", "Crime", "Thriller"]';
      expect(formatText(genres)).toBe('Drama, Crime, Thriller');
    });

    test('should handle already parsed arrays', () => {
      const genres = [{ name: 'Drama' }, { name: 'Crime' }];
      expect(formatText(genres)).toBe('Drama, Crime');
    });

    test('should handle string arrays', () => {
      const genres = ['Drama', 'Crime'];
      expect(formatText(genres)).toBe('Drama, Crime');
    });

    test('should handle null and undefined', () => {
      expect(formatText(null)).toBe(null);
      expect(formatText(undefined)).toBe(null);
    });

    test('should handle empty arrays', () => {
      expect(formatText('[]')).toBe(null);
      expect(formatText([])).toBe(null);
    });

    test('should handle invalid JSON gracefully', () => {
      expect(formatText('invalid json')).toBe('invalid json');
      expect(formatText('{"not": "array"}')).toBe(null);
    });

    test('should handle objects without name property', () => {
      const genres = '[{"id": 18}, {"id": 80}]';
      expect(formatText(genres)).toBe(null);
    });

    test('should handle mixed valid/invalid objects', () => {
      const genres = '[{"name": "Drama"}, {"id": 80}, {"name": "Crime"}]';
      expect(formatText(genres)).toBe('Drama, Crime');
    });
  });
});
