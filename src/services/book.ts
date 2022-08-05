import axios from 'axios';

import { api } from '../utils';
import { CommentModel } from '../models';

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
  constructor(private model: { comment: CommentModel }) {
    this.list = this.list.bind(this);
    this.get = this.get.bind(this);
  }

  async list({ page = 1, size = 3 }) {
    await this.model.comment.db.validateInt(+!page, 'Page in query of books');
    await this.model.comment.db.validateInt(+!size, 'Page size in query of books');
    const books = await (await axios.get<Book[]>(`${api}books?page=${page}&pageSize=${size}`)).data;
    if (books.length > 0) {
      books.sort((bookA: Book, bookB: Book) => bookA.released.localeCompare(bookB.released));
      books.forEach(async (book) => {
        const bookId = book.url.match(/\d+/g)?.join();
        book.commentCount = await (await this.model.comment.listByBook(`${bookId}`))?.length;
      });
    }
    return books;
  }

  async get(id: string) {
    await this.model.comment.db.validateInt(+!id, 'Id of book');
    const book = await (await axios.get<Book>(`${api}books/${id}`)).data;
    return book;
  }
}
