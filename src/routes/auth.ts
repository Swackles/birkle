import express, { Request, Response } from 'express';
import { ErrorTypes, main as ErrorJSON } from './../util/errorResponse';
import { Pool } from 'pg'
import crypto from 'crypto'
const client = new Pool()

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!/\S+@\S+\.\S+/.test(email)) res.status(400).send(ErrorJSON(ErrorTypes.AUTH_INVALID_EMAIL))

  await client.connect();

  // checks if user already registered with email 
  let result = await client.query('SELECT * FROM users WHERE email=$1', [email])
  if (result.rows.length != 0) return res.status(400).send(ErrorJSON(ErrorTypes.USER_EXISTS))

  const token = crypto.randomBytes(50).toString('hex')
  console.log(token)

  const queryParams = [name.forname, name.surname, email, password, token]
  result = await client.query('INSERT INTO public.users (firstname, surname, email, password, token) VALUES($1, $2, $3, $4, $5);', queryParams)
  res.send({ token: token })
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!/\S+@\S+\.\S+/.test(email)) res.status(400).send(ErrorJSON(ErrorTypes.AUTH_INVALID_EMAIL))

  await client.connect();

  const queryParams = [ email, password]
  const result = await client.query('SELECT token FROM users WHERE email=$1 AND password=$2', queryParams)
  if (result.rows.length == 0) return res.status(401).send(ErrorJSON(ErrorTypes.INVALID_EMAIL_PASSWORD))
  res.send({ token: result.rows[0].token })
})
export default router;
