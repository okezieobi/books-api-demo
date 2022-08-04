import pgPromise, { QueryFile } from 'pg-promise';
import { join as joinPath } from 'path';
import { config } from 'dotenv';
import Ajv, { Schema } from 'ajv';
import ajvKeywords from 'ajv-keywords';
import ajvFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';

config();
const databaseUrl = new Map();
databaseUrl.set('development', process.env.DEV_DATABASE_URL);
databaseUrl.set('production', process.env.DATABASE_URL);
const client = pgPromise()(databaseUrl.get(process.env.NODE_ENV));

const ajv = new Ajv({ allErrors: true });
ajvFormats(ajv);
ajvKeywords(ajv);
ajvErrors(ajv);

export class Database {
  readonly client = client;

  async validate(arg: unknown, schema: Schema, context?: string) {
    const isValid = ajv.compile(schema);
    if (!isValid(arg))
      throw {
        message: `${context} validation failed`,
        name: 'InvalidArg',
        failures: isValid,
      };
  }

  queryErrHandler(
    err: Error & { detail: string; table: string; constraint: string; routine: string },
  ) {
    const { name, message, detail, table, constraint, routine } = err;
    throw { name: 'Query', alias: name, message, detail, table, constraint, routine };
  }

  sql(file: string) {
    const fullPath = joinPath(__dirname, `../../sql/${file}.sql`); // generating full path;
    return new QueryFile(fullPath, { minify: true });
  }
}

if (process.env.NODE_ENV === 'development') {
  const { sql } = new Database();
  const commentTable = sql('comments/table');
  client.none(commentTable).catch(console.error);
}
