/**
 * @fileoverview Application constants
 */
module.exports = {
  HTTP: {
    OK:          200,
    CREATED:     201,
    BAD_REQUEST: 400,
    SERVER_ERR:  500,
  },
  ERR_MSGS: {
    INVALID_BLOCK: 'Invalid availability block',
    INVALID_DATE:  'Invalid date parameters',
    INVALID_USER:  'Invalid user object',
  },
  USER_TYPE: {
    BABY:        'baby',
    INTERVIEWER: 'interviewer',
    PROSPECTIVE: 'prospective',
  },
}
