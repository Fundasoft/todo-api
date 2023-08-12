const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./router');

app.use(cors({
  origin: 'http://localhost:3001',
}));
app.use(express.json());

app.use('/todos', router);

app.use(function (err, req, res, next) { // middleware de error
  console.log(err);
  res.send('Algo salió mal');
});

app.listen(3000, function() {
  console.log('¡La API está en funcionamiento!');
});
