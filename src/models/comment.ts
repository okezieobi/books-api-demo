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
  selectMany: sql('comment/selectMany'),
};

export class CommentModel {
  readonly db = new Database();

  async listByBook(bookId: string) {
    return this.db.client.manyOrNone<Comment | undefined>(queries.listByBook, { bookId });
  }

  async insert(comment: string, bookId: string, ipAddress: string) {
    return this.db.client
      .oneOrNone<Comment>(queries.insert, { comment, bookId, ipAddress })
      .catch(this.db.queryErrHandler);
  }

  async list(page = 0, size = 1) {
    return this.db.client.manyOrNone<Comment | undefined>(queries.selectMany, { page, size });
  }
}
