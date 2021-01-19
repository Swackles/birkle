import { Pool } from "pg";
import { Request, Response, NextFunction } from 'express';
import { token } from "morgan";

const client = new Pool()

async function main(req: Request, res: Response, next: NextFunction) {
  client.connect();
  const token = req.header('Authorization')

  const { rows } = await client.query('SELECT * FROM users WHERE token=$1', [token])

  res.locals.user = rows[0]
  next();
}

export default main