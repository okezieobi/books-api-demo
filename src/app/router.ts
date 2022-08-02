import { Router, Request, Response, NextFunction } from 'express';

import { BookServices } from '../services';
import { CommentModel } from '../models';

export const router = Router();
export const bookRouter = Router();

const bookScope = 'books';

bookRouter.route('/').get(async (req: Request, res: Response, next: NextFunction) => {
    const { list } = new BookServices({ comment: new CommentModel() });
    res.locals[bookScope] = await list().catch(next);
    next();
});

function dispatchResponse(scope: string) {
    return (req: Request, res: Response): void => {
        res.status(res.statusCode ?? 200).send({
          success: { ...res.locals[scope] },
        });
      }
}

router.use(`/${bookScope}`, bookRouter, dispatchResponse(bookScope));


