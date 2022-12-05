const express = require('express');
const app = express();
require('dotenv').config()
require('express-async-errors')




app.use('/static', express.static('assets'));
app.use(express.json())

const dogsRouter = require('./routes/dogs')
app.use('/dogs', dogsRouter)
console.log("POrt in environment:", process.env.port)




// Create a middleware function that will log the method and URL path of the request
// to the terminal for all requests to the server.
app.use('/', (req, res, next) => {
  // have your function log the "Current time: " string with the Date function
  // to an ISO string
  console.log("Current time: ", new Date().toISOString());
  console.log(req.method)
  console.log(req.originalUrl)

  res.on('finish', () => {
    console.log(res.statusCode)
  })
  // Since no response has been returned yet invoke the `next` function so it
  // knows to move on to the next middleware function
  next();
});


// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});



// Error Handler
app.use('/', (req, res, next) => {
  const error = new Error("The requested resource couldn't be found..");
  error.statusCode = 404;
  throw error;
})


app.use('/', (err, req, res, next) => {
  console.log(err);
  res.statusCode = err.statusCode || 500;

  const isProduct = process.env.NODE_ENV === 'production';

  res.json({
    message: err.message || "Something went wrong..",
    statusCode: err.statusCode,
    stack: isProduction ? null : err.stack
  })
})



const port = process.env.PORT;
app.listen(port, () => console.log('Server is listening on port', port));