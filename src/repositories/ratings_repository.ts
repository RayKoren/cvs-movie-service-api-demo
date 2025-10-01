import sqlite3 from 'sqlite3';
import path from 'path';
import { Rating, Paginated, FindAllOptions } from '../types';
import { buildWhereClause, buildOrderClause } from '../helpers/sql_helpers';


export class RatingsRepository {
  private ratingsDb: sqlite3.Database;

  constructor() {
    const dbPath = path.join(__dirname, '../../db');
    this.ratingsDb = new sqlite3.Database(path.join(dbPath, 'ratings.db'));
  }

  async findById(id: number) {
    return new Promise((resolve, reject) => {
      this.ratingsDb.get('SELECT * FROM ratings WHERE ratingId = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row || undefined);
      });
    });
  }

  async getAverageForMovie(movieId: number): Promise<number | null> {
    const row = await new Promise<{ avg: number } | undefined>((resolve, reject) => {
      this.ratingsDb.get('SELECT AVG(rating) as avg FROM ratings WHERE movieId = ?', [movieId], (err, result) => {
        if (err) reject(err);
        else resolve(result as { avg: number } | undefined);
      });
    });
    if (!row || row.avg === null || row.avg === undefined) return null;
    return Number(row.avg);
  }

  private async countTotal(whereClause: string, params: any[]): Promise<number> {
    const countQuery = `SELECT COUNT(*) as total FROM ratings ${whereClause}`;
    const row = await new Promise<{ total: number }>((resolve, reject) => {
      this.ratingsDb.get(countQuery, params, (err, result) => {
        if (err) reject(err);
        else resolve(result as { total: number });
      });
    });
    return row.total;
  }

  async findAll(opts: FindAllOptions<Rating>): Promise<Paginated<Rating>> {
    const { page, limit = 10, where, order, select, like } = opts;
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const { clause: whereClause, params } = buildWhereClause<Rating>(where, like);
    
    // Build ORDER BY clause
    const orderClause = buildOrderClause(order);
    
    // Get total count
    const total = await this.countTotal(whereClause, params);
    
    // Get paginated data
    const columns = Array.isArray(select) && select.length > 0 ? select.join(', ') : '*';
    const dataQuery = `SELECT ${columns} FROM ratings ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
    const data = await new Promise<Rating[]>((resolve, reject) => {
      this.ratingsDb.all(dataQuery, [...params, limit, offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Rating[]);
      });
    });
    
    return {
      data,
      total,
      page,
      limit
    };
  }
  }