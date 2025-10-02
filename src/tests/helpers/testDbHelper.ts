import sqlite3 from 'sqlite3';
import path from 'path';
import { getTestDbPath } from '../test_setup';

export function createTestMovieRepository() {
  const testDbPath = getTestDbPath();
  const moviesDb = new sqlite3.Database(path.join(testDbPath, 'movies.db'));
  
  return {
    findById: (id: number) => new Promise((resolve, reject) => {
      moviesDb.get('SELECT * FROM movies WHERE movieId = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row || undefined);
      });
    }),
    
    findAll: (opts: any) => new Promise((resolve, reject) => {
      const { page, limit = 10, where, like, order, select } = opts;
      const offset = (page - 1) * limit;
      
      // Build WHERE clause
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
      
      const whereClause = parts.length > 0 ? `WHERE ${parts.join(' AND ')}` : '';
      
      // Build ORDER BY clause
      let orderClause = '';
      if (order) {
        const orderParts = Object.entries(order).map(([key, direction]) => `${key} ${(direction as string).toUpperCase()}`);
        if (orderParts.length > 0) {
          orderClause = `ORDER BY ${orderParts.join(', ')}`;
        }
      }
      
      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM movies ${whereClause}`;
      moviesDb.get(countQuery, params, (err, countRow) => {
        if (err) {
          reject(err);
          return;
        }
        
        const total = (countRow as any).total;
        
        // Get paginated data
        const columns = Array.isArray(select) && select.length > 0 ? select.join(', ') : '*';
        const dataQuery = `SELECT ${columns} FROM movies ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
        
        moviesDb.all(dataQuery, [...params, limit, offset], (err, rows) => {
          if (err) reject(err);
          else resolve({ data: rows, total, page, limit });
        });
      });
    })
  };
}

export function createTestRatingsRepository() {
  const testDbPath = getTestDbPath();
  const ratingsDb = new sqlite3.Database(path.join(testDbPath, 'ratings.db'));
  
  return {
    findById: (id: number) => new Promise((resolve, reject) => {
      ratingsDb.get('SELECT * FROM ratings WHERE ratingId = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row || undefined);
      });
    }),
    
    findAll: (opts: any) => new Promise((resolve, reject) => {
      const { page, limit = 10, where, like, order, select } = opts;
      const offset = (page - 1) * limit;
      
      // Build WHERE clause
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
      
      const whereClause = parts.length > 0 ? `WHERE ${parts.join(' AND ')}` : '';
      
      // Build ORDER BY clause
      let orderClause = '';
      if (order) {
        const orderParts = Object.entries(order).map(([key, direction]) => `${key} ${(direction as string).toUpperCase()}`);
        if (orderParts.length > 0) {
          orderClause = `ORDER BY ${orderParts.join(', ')}`;
        }
      }
      
      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM ratings ${whereClause}`;
      ratingsDb.get(countQuery, params, (err, countRow) => {
        if (err) {
          reject(err);
          return;
        }
        
        const total = (countRow as any).total;
        
        // Get paginated data
        const columns = Array.isArray(select) && select.length > 0 ? select.join(', ') : '*';
        const dataQuery = `SELECT ${columns} FROM ratings ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
        
        ratingsDb.all(dataQuery, [...params, limit, offset], (err, rows) => {
          if (err) reject(err);
          else resolve({ data: rows, total, page, limit });
        });
      });
    }),
    
    getAverageForMovie: (movieId: number) => new Promise((resolve, reject) => {
      ratingsDb.get('SELECT AVG(rating) as avg FROM ratings WHERE movieId = ?', [movieId], (err, result) => {
        if (err) reject(err);
        else {
          const row = result as { avg: number } | undefined;
          if (!row || row.avg === null || row.avg === undefined) {
            resolve(null);
          } else {
            resolve(Number(row.avg));
          }
        }
      });
    })
  };
}
