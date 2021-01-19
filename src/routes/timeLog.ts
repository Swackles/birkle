import express, { NextFunction, Request, Response } from 'express';
import { ErrorTypes, main as ErrorJSON } from './../util/errorResponse';
import { Pool } from 'pg'

const client = new Pool()

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { rows } = await client.query('SELECT id, user_id AS "userID", description, start_time AS "startTime", end_time AS "endTime" FROM time_logs WHERE user_id=$1', [res.locals.user.id])

  res.send(rows)
})

router.get('/:id([0-9]+)', checkTimeLogExists, async (req: Request, res: Response) => {
  const { id } = req.params

  const { rows } = await client.query('SELECT id, user_id AS "userID", description, start_time AS "startTime", end_time AS "endTime" FROM time_logs WHERE id=$1', [id])

  res.send(rows[0])
})

router.delete('/:id([0-9]+)', checkTimeLogExists, async (req: Request, res: Response) => {
  const { id } = req.params

  await client.query('DELETE FROM time_logs WHERE id=$1 AND user_id=$2', [id, res.locals.user.id])

  res.send()
})

router.put('/:id([0-9]+)', checkTimeLogOngoing, async (req: Request, res: Response) => {
  const { id } = req.params
  const { description, startTime, endTime } = req.body

  if (description == undefined || startTime == undefined || endTime == undefined) return res.status(400).send(ErrorJSON(ErrorTypes.MANDATORY_FIELD_MISSING))

  if (!(new Date(startTime).getTime() > 0 && new Date(endTime).getTime() > 0)) return res.status(400).send(ErrorJSON(ErrorTypes.TIMESTAMP_INCORRECT))

  const queryParams = [id, res.locals.user.id, description, startTime, endTime]
  const { rows } = await client.query('UPDATE time_logs SET description=$3, start_time=$4, end_time=$5 WHERE id=$1, user_id=$2', queryParams)

  res.send(rows)
})

router.post('/:id([0-9]+)', checkTimeLogEnded, async (req: Request, res: Response) => {
  const { endTime } = req.body;

  if (endTime == undefined || !(new Date(endTime).getTime() > 0)) return res.status(400).send(ErrorJSON(ErrorTypes.MANDATORY_FIELD_MISSING))

  await client.query('UPDATE time_logs SET end_time=$1', [endTime])

  res.send()
})

router.post('/', async (req: Request, res: Response) => {
  const { description, startTime, endTime } = req.body;

  if (description == undefined || startTime == undefined) return res.status(400).send(ErrorJSON(ErrorTypes.MANDATORY_FIELD_MISSING))

  if (!(new Date(startTime).getTime() > 0 && (endTime == undefined || new Date(endTime).getTime() > 0))) return res.status(400).send(ErrorJSON(ErrorTypes.TIMESTAMP_INCORRECT))

  if (await checkOverlaps(new Date(startTime), new Date(endTime))) return res.status(400).send(ErrorJSON(ErrorTypes.TIMELOG_OVERLAP))
  await client.connect();

  const queryParams = [res.locals.user.id, description, startTime, endTime]
  const result = await client.query('INSERT INTO time_logs(user_id, description, start_time, end_time) VALUES($1, $2, $3, $4)', queryParams)

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

async function checkTimeLogExists(req: Request, res: Response, next: NextFunction) {
  const { rows } = await client.query('SELECT * FROM time_logs WHERE id=$1 AND user_id=$2', [req.params.id, res.locals.user.id])

  if (rows.length == 0) return res.status(400).send(ErrorJSON(ErrorTypes.TIMELOG_ID_MISSING))
  
  next()
}

async function checkTimeLogOngoing(req: Request, res: Response, next: NextFunction) {
  const { rows } = await client.query('SELECT * FROM time_logs WHERE id=$1 AND user_id=$2 AND end_time IS NOT NULL', [req.params.id, res.locals.user.id])

  if (rows.length == 0) return res.status(400).send(ErrorJSON(ErrorTypes.TIMELOG_ONGOING))

  next()
}

async function checkTimeLogEnded(req: Request, res: Response, next: NextFunction) {
  const { rows } = await client.query('SELECT * FROM time_logs WHERE id=$1 AND user_id=$2 AND end_time IS NULL', [req.params.id, res.locals.user.id])

  if (rows.length == 0) return res.status(400).send(ErrorJSON(ErrorTypes.TIMELOG_ENDED))

  next()
}

export default router;
