import { Router, Request, Response, NextFunction } from 'express';

import { BookServices, CommentServices, CharacterServices } from '../services';
import { CommentModel } from '../models';

export const router = Router();
function dispatchResponse(scope: string) {
  return (req: Request, res: Response): void => {
    res.status(res.statusCode ?? 200).send({
      success: { ...res.locals[scope] },
    });
  };
}

export const bookRouter = Router();
const bookScope = 'books';
bookRouter.get('/', async ({ query }: Request, res: Response, next: NextFunction) => {
  const { list } = new BookServices({ comment: new CommentModel() });
  res.locals[bookScope] = await list(query).catch(next);
  next();
});

bookRouter.get('/:id', async ({ params: { id } }: Request, res: Response, next: NextFunction) => {
  const { get } = new BookServices({ comment: new CommentModel() });
  res.locals[bookScope] = await get(id).catch(next);
  next();
});

const commentRouter = Router();
const commentScope = 'comments';
commentRouter
  .route('/')
  .post(async ({ body: { bookId, body }, ip }: Request, res: Response, next: NextFunction) => {
    const { create } = new CommentServices(new CommentModel());
    res.locals[commentScope] = await create(body, bookId, ip).catch(next);
    res.status(201);
    next();
  })
  .get(async ({ query }: Request, res: Response, next: NextFunction) => {
    const { list } = new CommentModel();
    res.locals[commentScope] = await list(query).catch(next);
    next();
  });

const characterRouter = Router();
const characterScope = 'characters';
characterRouter.get('/', async ({ query }: Request, res: Response, next: NextFunction) => {
  const { list } = new CharacterServices({ comment: new CommentModel() });
  res.locals[characterScope] = await list(query).catch(next);
  next();
});

characterRouter.get(
  '/:id',
  async ({ params: { id } }: Request, res: Response, next: NextFunction) => {
    const { get } = new CharacterServices({ comment: new CommentModel() });
    res.locals[characterScope] = await get(`${id}`).catch(next);
    next();
  },
);

router.use(`/${bookScope}`, bookRouter, dispatchResponse(bookScope));
router.use(`/${commentScope}`, commentRouter, dispatchResponse(commentScope));
router.use(`/${characterScope}`, characterRouter, dispatchResponse(characterScope));
