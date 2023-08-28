const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./router');

app.use(cors({
  origin: 'http://fundasoft-todo-app-josue.s3-website.us-east-2.amazonaws.com',
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

// GET http://api.example.com/todos?user={user_id}
// GET http://api.example.com/todos/{task_id}?user={user_id}
// POST http://api.example.com/todos?user={user_id}
// PUT http://api.example.com/todos/{task_id}?user={user_id}
// DELETE http://api.example.com/todos/{task_id}?user={user_id}