import express, { Request, Response } from 'express';
import { ErrorTypes, main as ErrorJSON } from './../util/errorResponse';
import { Pool } from 'pg'

const client = new Pool()

const router = express.Router();

router.get('/:id([0-9]+)', async (req: Request, res: Response) => {
  const { id } = req.params

  const { rows } = await client.query('SELECT id, user_id AS "userID", description, start_time AS "startTime", end_time AS "endTime" FROM time_logs WHERE id=$1', [id])

  res.send(rows[0])
})

router.post('/', async (req: Request, res: Response) => {
  const { description, startTime, endTime } = req.body;
  if (!(new Date(startTime).getTime() > 0 && new Date(endTime).getTime() > 0)) return res.status(400).send(ErrorJSON(ErrorTypes.TIMESTAMP_INCORRECT))

  if (await checkOverlaps(new Date(startTime), new Date(endTime))) return res.status(400).send(ErrorJSON(ErrorTypes.TIMELOG_OVERLAP))
  await client.connect();

  const queryParams = [res.locals.user.id, description, startTime, endTime]
  const result = await client.query('INSERT INTO public.time_logs(user_id, description, start_time, end_time) VALUES($1, $2, $3, $4);', queryParams)

  res.send()
})

/**
 * Checks if dates overlap with an already existing daterange
 * @param startTime start time
 * @param endTime end time
 * @returns returns a boolean value
 */
async function checkOverlaps(startTime: Date, endTime: Date | undefined): Promise<boolean> {
  client.connect()

  if (endTime === undefined) {
    const { rows } = await client.query("SELECT * FROM time_logs WHERE tsrange(time_logs.start_time, time_logs.end_time, '[]') && tsrange($1, $2, '[]')", [startTime, endTime])

    return rows.length != 0
  } else {
    const { rows } = await client.query('SELECT * FROM time_logs WHERE $1 BETWEEN start_time and end_time', [startTime])

    return rows.length != 0
  }
}

export default router;