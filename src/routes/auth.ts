import express, { Request, Response } from 'express';
import { ErrorTypes, main as ErrorJSON } from './../util/errorResponse';
import { Client } from 'pg'
import crypto from 'crypto'
const client = new Client()

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!/\S+@\S+\.\S+/.test(email)) res.status(401).send(ErrorJSON(ErrorTypes.AUTH_INVALID_EMAIL))

  await client.connect();

  // checks if user already registered with email 
  let result = await client.query('SELECT * FROM users WHERE email=$1', [email])
  if (result.rows.length != 0) return res.status(401).send(ErrorJSON(ErrorTypes.USER_EXISTS))

  const token = crypto.randomBytes(50).toString('hex')
  console.log(token)

  const queryParams = [name.forname, name.surname, email, password, token]
  result = await client.query('INSERT INTO public.users (firstname, surname, email, password, token) VALUES($1, $2, $3, $4, $5);', queryParams)
  res.send({ token: token })
});

export default router;
