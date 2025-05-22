import express from 'express';
import { Request, Response } from 'express';

const myFunction = () => {
  console.log('Hello from myFunction!');
};

myFunction.myName = 'John';

const router = express.Router();

router.get('/', (request: Request, response: Response) => {
  const title = 'BS - Site';
  const name = 'John';
  // @ts-ignore
  const user = request.session.user || null;

  response.render('root', { title, name, user });
});

export default router;
