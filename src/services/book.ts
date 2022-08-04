import axios from 'axios';

import { api } from '../utils';
import { CommentModel } from '../models';

export interface Model {
  comment: CommentModel;
}

interface Book {
  readonly url: string;
  readonly name: string;
  readonly isbn: string;
  readonly authors: string[];
  readonly numberOfPages: number;
  readonly publisher: string;
  readonly country: string;
  readonly mediaType: string;
  readonly released: string;
  readonly characters: string[];
  readonly povCharacters: string[];
  commentCount?: number;
}

export class BookServices {
  constructor(readonly model: Model) {
    this.list = this.list.bind(this);
  }

  async list({ page = 1, size = 3 }): Promise<Book[]> {
    const books = await (await axios.get<Book[]>(`${api}books?page=${page}&pageSize=${size}`)).data;
    if (books.length > 0) {
      books.sort((bookA: Book, bookB: Book) => bookA.released.localeCompare(bookB.released));
      books.forEach(async (book) => {
        const bookId = `${book.url[book.url.length - 1]}`;
        book.commentCount = await (await this.model.comment.listByBook(bookId))?.length;
      });
    }
    return books;
  }
}
