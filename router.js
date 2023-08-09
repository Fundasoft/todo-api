const mysql = require('mysql2');
const express = require('express');
const router = express.Router();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'fundasoft',
});

// GET
router.get('/', function (req , res) {
  const userId = req.query.user;

  connection.query(
    `SELECT * FROM tasks WHERE user = ${userId}`,
    function (error, results) {
      if (error) res.status(500).send('No se pudieron obtener las tareas.');

      res.status(200).json({
        results,
      });
    }
  );
});

// GET | taskID
router.get('/:taskId', function (req, res) {
  const userId = req.query.user;
  const taskId = req.params.taskId;

  connection.query(
    `SELECT * FROM tasks WHERE user = ${userId} AND id = ${taskId}`,
    function (error, results) {
      if (error) res.status(500).send('No se pudo obtener la tarea.');

      res.status(200).json({
        results,
      });
    }
  );
});

// POST | http://localhost:3000/todos/?user=1
router.post('/', function (req, res) {
  const description = req.body.description;
  const userId = req.query.user;

  connection.query(
    `INSERT INTO tasks (description, user) VALUES ('${description}', ${userId})`,
    function (error, results) {
      if (error) res.status(500).send(`INSERT INTO tasks (description, user) VALUES ('${description}', ${userId})`);

      res.status(201).json({
        id: results.insertId,
        description,
      });
    }
  );
});


// DELETE | http://localhost:3000/todos/4?user=1 | /todos/taskId?user=userId
router.delete('/:taskId', function (req, res) {
  const userId = req.query.user;
  const taskId = parseInt(req.params.taskId);

  connection.query(
    `DELETE FROM tasks WHERE id = ${taskId} AND user = ${userId}`,
    function (error, results) {
      if (error) res.status(500).send('No se pudo obtener la tarea.');

      res.status(200).send(`Se eliminó la tarea ${taskId} del usuario ${userId}`);
    }
  );
});


// PUT
router.put('/:taskId', function (req, res) {
    const userId = req.query.user;
    const taskId = parseInt(req.params.taskId);
    const body = req.body;
    let updates = [];

    const validColumn = ['description', 'done','user'];

    validColumn.map(column => {
      if (body[column] !== undefined) {
        updates.push(`${column} = '${body[column]}'`)
      }
    })
    const queryUpdates = updates.join(', ');

    connection.query(
      `UPDATE tasks SET ${queryUpdates} WHERE user = ${userId} AND id = ${taskId}`,
      function (error, results) {
        if (error) res.status(500).send('No se pudo actualizara la tarea.');
  
        res.status(200).send(`Se actualizó la tarea ${taskId} del usuario ${userId}`);
      }
    );
})

module.exports = router;
