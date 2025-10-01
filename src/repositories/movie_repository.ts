import sqlite3 from 'sqlite3';
import path from 'path';
import { Movie, Paginated, FindAllOptions } from '../types';
import { buildWhereClause, buildOrderClause } from '../helpers/sql_helpers';


export class MovieRepository {
  private moviesDb: sqlite3.Database;

  constructor() {
    const dbPath = path.join(__dirname, '../../db');
    this.moviesDb = new sqlite3.Database(path.join(dbPath, 'movies.db'));
  }

  async findById(id: number) {
    return new Promise((resolve, reject) => {
      this.moviesDb.get('SELECT * FROM movies WHERE movieId = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row || undefined);
      });
    });
  }

  private async countTotal(whereClause: string, params: any[]): Promise<number> {
    const countQuery = `SELECT COUNT(*) as total FROM movies ${whereClause}`;
    const row = await new Promise<{ total: number }>((resolve, reject) => {
      this.moviesDb.get(countQuery, params, (err, result) => {
        if (err) reject(err);
        else resolve(result as { total: number });
      });
    });
    return row.total;
  }

  async findAll(opts: FindAllOptions<Movie>): Promise<Paginated<Movie>> {
    const { page, limit = 10, where, order, select, like } = opts;
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const { clause: whereClause, params } = buildWhereClause<Movie>(where, like);
    
    // Build ORDER BY clause
    const orderClause = buildOrderClause(order);
    
    // Get total count
    const total = await this.countTotal(whereClause, params);
    
    // Get paginated data
    const columns = Array.isArray(select) && select.length > 0 ? select.join(', ') : '*';
    const dataQuery = `SELECT ${columns} FROM movies ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
    const data = await new Promise<Movie[]>((resolve, reject) => {
      this.moviesDb.all(dataQuery, [...params, limit, offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Movie[]);
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