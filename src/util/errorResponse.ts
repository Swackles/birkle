enum ErrorTypes {
  TIMELOG_ID_MISSING = 'TIMELOG_ID_MISSING',
  TIMELOG_ONGOING = 'TIMELOG_ONGOING',
  TIMELOG_OVERLAP = 'TIMELOG_OVERLAP',
  MANDATORY_FIELD_MISSING = 'MANDATORY_FIELD_MISSING',
  USER_EXISTS = 'USER_EXISTS',
  AUTH_INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_EMAIL_PASSWORD = 'INVALID_EMAIL_PASSWORD',
  TIMESTAMP_INCORRECT = 'TIMESTAMP_INCORRECT'
}

const errors = {
  'TIMELOG_ID_MISSING': 'Timelog with this id doesn\'t exist',
  'TIMELOG_ONGOING': 'Timelog is still ongoing',
  'TIMELOG_OVERLAP': 'There\'s an already existing time range that overlaps',
  'MANDATORY_FIELD_MISSING': 'The mandatory field is missing or malformed',
  'USER_EXISTS': 'User already exists',
  'INVALID_EMAIL': 'Email address is invalid',
  'INVALID_EMAIL_PASSWORD': 'Email or password is incorrect',
  'TIMESTAMP_INCORRECT': 'Timestamp is in incorrect'
}

function main (error: ErrorTypes): { code: string, msg: string } {
  return { code: error, msg: errors[error] }
}

export { ErrorTypes, main }
