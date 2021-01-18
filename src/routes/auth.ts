import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', function(req: Request, res: Response) {
  res.status(200).send({
    title: 'test'
  })
});

export default router;
