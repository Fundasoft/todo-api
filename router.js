const mysql = require('mysql2');
const express = require('express');
const router = express.Router();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fundasoft',
});


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

router.post('/', function (req, res) {
  const description = req.body.description;
  const userId = req.query.user;
  connection.query(
    `INSERT INTO tasks (description, user) VALUES ('${description}', ${userId})`,
    function (error, results) {
      if (error) res.status(500).send('La tarea no se almacenó.');

      res.status(201).json({
        id: results.insertId,
        description,
      });
    }
  );
});

router.delete('/:taskId', function (req, res) {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== id);
  res.send('La tarea fue borrada con éxito.');
});

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

module.exports = router;
