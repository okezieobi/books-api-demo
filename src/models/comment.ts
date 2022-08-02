import { db, sql } from './db';

export interface Comment {
    id?:  string;
    bookId: string;
    body: string;
    ipAddress: string;
    createdAt: string;
  }

const queries = {
    listByBook: sql('comments/listByBook'),
};

export class CommentModel {
    async listByBook(bookId: string): Promise<Comment[] | undefined> {
        return db.manyOrNone(queries.listByBook, { bookId });
    }
} 