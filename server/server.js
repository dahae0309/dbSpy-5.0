// Allows for the use of stored sensitive information in a .env file
require('dotenv').config();

const express = require('express');

const apiRouter = require('./routes/api');

const app = express();
const PORT = 3000;

// -------------
/** I don't think we need routes for home, but we w
* Home
* Login
* Display
* Logout
*/

// Parse Incoming requests with a json body
app.use(express.json());
// Parse incoming requests with url encoded payloads
app.use(express.urlencoded({extended: true }));


// Implementation is flexibile, can change if needed
app.use('/api', apiRouter);

// Catch-all error handler
app.use('*', (req, res) => {
  res.sendStatus(404);
});

// Global error handler, any middleware function passing next(err) will follow this structure
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' }
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

//