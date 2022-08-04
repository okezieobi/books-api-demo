import axios from 'axios';

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
  async list(page?: string, size?: string, gender?: string) {
    const characters = await (
      await axios.get<Character[]>(
        `${api}characters?page=${page}&pageSize=${size}&gender=${gender}`,
      )
    ).data;
    return characters;
  }
}
