import axios from "axios";

import { api } from '../utils';
import { CommentModel , Comment } from '../models';

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
    readonly reLeased: string;
    readonly characters: string[];
    readonly povCharacters: string[];
    comments?: Comment[];
}

export class BookServices {
    constructor(readonly model: Model) {
        this.list = this.list.bind(this)
    }

    async list(): Promise<Book[]> {
        const books = await (await axios.get<Book[]>(`${api}books`)).data;
        if (books.length > 0) {
            books.sort((bookA: Book, bookB: Book) => bookA.reLeased.localeCompare(bookB.reLeased))
            books.forEach(async (book) => {
                const bookId = `${book.url[book.url.length - 1]}`;
                book.comments = await this.model.comment.listByBook(bookId);
            });
        }
        return books;
    }
}