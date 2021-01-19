# Birkle IT

## Installation

### Environment variables

* POSTGRES_PASSWORD, PGPASSWORD - Database password
* POSTGRES_USER, PGUSER - Database username
* POSTGRES_DB, PGDATABASE - Database name
* PGHOST - Database host, default should be set as "db"
* PGPORT - Database port, default should be set as "5432"
* DATABASE_URL - Database url for the migration engine
  * postgresql://[PGUSER]:[PGPASSWORD]@[PGHOST]:[PGPORT]/[PGDATABASE]

### Running

To run the porgram you need to [install docker compose](https://docs.docker.com/compose/install/)

Run the command, this will build the image and run the application

```bash
docker-compose up -d
```

Next you need to run the migrations

```bash
docker exec -it birkle_app_1 npm run migrate up
```

With this your application should be working and is accesible on `localhost:300` and database on `localhost:5432`

## Endpoints

### Auth

Auth endpoints return tokens that have to be put in the header under `Authorization`

#### POST /auth/register

Registers a new user, when successfully registed will return an token

#### POST /auth/login

login as an existing user, when login is successfull, it will return a token

### Time Log

#### GET /timelog

Get all of the timelogs

```json
[
    {
        "id": 2,
        "userID": 3,
        "description": "ttest",
        "startTime": "2012-04-23T15:25:43.511Z",
        "endTime": "2012-04-26T15:25:43.511Z"
    },
    {
        "id": 3,
        "userID": 3,
        "description": "ttest",
        "startTime": "2012-04-23T15:25:43.511Z",
        "endTime": "2012-04-26T15:25:43.511Z"
    }
]
```

#### GET /timelog/:id

Shows a specific timelog

| Param |     Description    |
|:-----:|:------------------:|
|   id  | Id for the timelog |

```json
{
    "id": 3,
    "userID": 3,
    "description": "ttest",
    "startTime": "2012-04-23T15:25:43.511Z",
    "endTime": "2012-04-26T15:25:43.511Z"
}
```

#### DELETE /timelog/:id

Deletes the timelog with id

| Param |     Description    |
|:-----:|:------------------:|
|   id  | Id for the timelog |

#### PUT /timelog/:id

Edits the timelog with it, unable to edit timelog that is in progress

| Param |     Description    |
|:-----:|:------------------:|
|   id  | Id for the timelog |

##### Body

|    Param    | Mandatory | Description                  |
|:-----------:|:---------:|------------------------------|
| description |    true   | Description for the time log |
|  startTime  |    true   | start time of the time log   |
|   endTime   |    true   | end time of the time log     |

#### POST /timelog/:id

Ends the timelog with with id, end time is supplied in the body

| Param |     Description    |
|:-----:|:------------------:|
|   id  | Id for the timelog |

##### Body

|    Param    | Mandatory | Description                  |
|:-----------:|:---------:|------------------------------|
|   endTime   |    true   | end time of the time log     |

#### POST /timelog

Submits a new timelog

##### Body

|    Param    | Mandatory | Description                  |
|:-----------:|:---------:|------------------------------|
| description |    true   | Description for the time log |
|  startTime  |    true   | start time of the time log   |
|   endTime   |    false   | end time of the time log     |
