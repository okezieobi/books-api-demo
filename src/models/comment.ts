import { Database } from './db';

export interface Comment {
  id?: string;
  bookId: string;
  body: string;
  ipAddress: string;
  createdAt: string;
}

const { sql } = new Database();
const queries = {
  listByBook: sql('comments/listByBook'),
  insert: sql('comments/insert'),
};

export class CommentModel {
  private db = new Database();

  async listByBook(bookId: string): Promise<Comment[] | undefined> {
    return this.db.client.manyOrNone(queries.listByBook, { bookId });
  }

  async insert(comment: string, bookId: string, ipAddress: string): Promise<Comment | undefined> {
    return this.db.client
      .oneOrNone(queries.insert, { comment, bookId, ipAddress })
      .catch(this.db.queryErrHandler);
  }
}
