import pgPromise, { QueryFile } from 'pg-promise';
import { join as joinPath } from 'path';
import { config } from 'dotenv';
import Ajv, { Schema } from 'ajv';
import ajvKeywords from 'ajv-keywords';
import ajvFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';

config();
export const db = pgPromise()(process.env.DEV_DATABASE_URL ?? '');

const ajv = new Ajv({ allErrors: true });
ajvFormats(ajv);
ajvKeywords(ajv);
ajvErrors(ajv);

export async function validate(arg: unknown, schema: Schema, context?: string) {
    const isValid = ajv.compile(schema);
    if (!isValid(arg))
      throw {
        message: `${context} validation failed`,
        name: 'InvalidArg',
        failures: isValid,
      };
  }

export function queryErrHandler(
    err: Error & { detail: string; table: string; constraint: string; routine: string },
  ) {
    const { name, message, detail, table, constraint, routine } = err;
    throw { name: 'Query', alias: name, message, detail, table, constraint, routine };
  }

export function sql(file: string) {
    const fullPath = joinPath(__dirname, `../../sql/${file}.sql`); // generating full path;
    return new QueryFile(fullPath, { minify: true });
  }

  const commentTable = sql('comment/table');
  db.none(commentTable).catch(console.error);
