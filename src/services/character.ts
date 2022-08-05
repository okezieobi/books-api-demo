import axios from 'axios';
import { Comment, CommentModel } from '../models';

import { api } from '../utils';

interface Character {
  url: string;
  name: string;
  gender: string;
  culture: string;
  born: string;
  died: string;
  titles: string[];
  aliases: string[];
  father: string;
  mother: string;
  spouse: string;
  allegiances: string[];
  books: string[];
  povBooks: string[];
  tvSeries: string[];
  playedBy: string[];
}

export class CharacterServices {
  constructor(private model: { comment: CommentModel }) {
    this.list = this.list.bind(this);
    this.get = this.get.bind(this);
  }

  async list({ page = 1, size = 5, gender = undefined }) {
    await this.model.comment.db.validateInt(+page, 'Page in query of characters');
    await this.model.comment.db.validateInt(+size, 'Page size in query of characters');
    const characters = await (
      await axios.get<Character[]>(
        `${api}characters?page=${page}&pageSize=${size}&gender=${gender}`,
      )
    ).data;
    return characters;
  }

  async get(id: string) {
    await this.model.comment.db.validateInt(+id, 'Id of character');
    const character = await (await axios.get<Character>(`${api}characters/${id}`)).data;
    return character;
  }
}
