const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
});
app.use(express.static('public'));

// Routes
app.post('/cookie/:name/:value', (req, res) => {
  res.cookie(req.params.name, req.params.value);
  res.send({ cookie: `${req.params.name}:${req.params.value}` });
});

app.get('/cookie', (req, res) => {
  res.send({ cookie: req.cookies });
});

app.get('/store/:storeName', (req, res) => {
  res.send({ name: req.params.storeName });
});

app.put('/store/:storeName', (req, res) => {
  res.send({ update: req.params.storeName });
});

app.delete('/store/:storeName', (req, res) => {
  res.send({ delete: req.params.storeName });
});

// Error middleware
app.get('/error', (req, res, next) => {
  throw new Error('Trouble in river city');
});

app.use((err, req, res, next) => {
  res.status(500).send({ type: err.name, message: err.message });
});

// Start server
const port = 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});