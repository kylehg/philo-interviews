Philo Interview Scheduler
=========================

An interview scheduler for Philo.

API
---

All responses will be JSON objects with the following fields:

- `data`: The body of the response, usually an object or array
- `error`: An error message, if applicable
- `request`: The request parameters as received by the server

### `GET /api/availability`

**Params**

- `from`: An ISO-formatted start date
- `to` _optional_: An ISO-formatted end date

**Response**

- `200`: A list of availabilities in half-hour blocks, sorted in chronological order, of the form:
  - `at`: A JSON datetime object for the start of the block
  - `users`: An array of objects of the form:
    - `name`: The name of the person free
    - `email`: The e-mail of the person free
    - `type`: One of `'baby'`, `'interviewer'`, or `'prospective'`
- `400`: The `from` field was empty, or the `from` or `to` field were malformed

### `POST /api/availability`

**Params**

- `user`: A JSON object of the form:
  - `name`: The name of the person free
  - `email`: The e-mail of the person free
  - `type`: One of `'baby'`, `'interviewer'`, or `'prospective'`
- `availability` _optional_: A list of the ISO-formatted start times of the half-hour blocks
    that the user is free

**Response**

TODO

Style Guide
-----------

- No semicolons unless necessary
- Two-space tabs
- No more than 1 line separating anything
- 100-character line limit
- 72-character comment limit
- Promises
- All functions must be commented, use JSDoc on non-anonymous functions
- All files must have a @fileoverview
- `require()`s in alphabetical order by module name, first libraries, then local modules
- Require only top-level modules, further variable dereferencing below
- Use native `forEach`, `map`, and `reduce` where possible; use Lodash for other utility calls
