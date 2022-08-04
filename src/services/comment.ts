import { CommentModel } from '../models';
import { BookServices } from './book';

export class CommentServices {
  private readonly book: BookServices;

  constructor(private readonly model: CommentModel) {
    this.book = new BookServices({ comment: model });
    this.create = this.create.bind(this);
  }

  async create(body: string, bookId: string, ip: string) {
    await this.book.get(bookId);
    return this.model.insert(body, bookId, ip);
  }
}
