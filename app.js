const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => { // Error Handler
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });

  /**
    Em códigos síncronos (fora de promises) pode-se lançar erros (throw new Error...) que garantidamente será capturado pelo próximo error handler;
    Em códigos assíncronos (dentro de then ou catch) é necessário criar o erro e mandar pro próximo middleware (next(error));
    Porém, para código dentro de um then(...) ao se lançar um erro ele será capturado pelo próximo catch, e esse por sua vez deve dá next(error);
   */
});

mongoose
  .connect(
    'mongodb+srv://node-app:node-app@cluster0.gafjw.mongodb.net/messages?retryWrites=true&w=majority'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
