enum ErrorTypes {
  TIMELOG_ID_MISSING = 'TIMELOG_ID_MISSING',
  TIMELOG_ONGOING = 'TIMELOG_ONGOING',
  TIMELOG_OVERLAP = 'TIMELOG_OVERLAP',
  MANDATORY_FIELD_MISSING = 'MANDATORY_FIELD_MISSING',
  USER_EXISTS = 'USER_EXISTS'
}

const errors = {
  'TIMELOG_ID_MISSING': 'Timelog with this id doesn\'t exist',
  'TIMELOG_ONGOING': 'Timelog is still ongoing',
  'TIMELOG_OVERLAP': 'There\'s an already existing time range that overlaps',
  'MANDATORY_FIELD_MISSING': 'The mandatory field is missing',
  'USER_EXISTS': 'User already exists',
}

function main (error: ErrorTypes): { code: string, msg: string } {
  return { code: error, msg: errors[error] }
}

export { ErrorTypes, main }
