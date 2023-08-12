const mysql = require('mysql2');
const express = require('express');
const router = express.Router();

console.log({
  host            : process.env.MYSQL_HOST,
  user            : process.env.MYSQL_USER,
  password        : process.env.MYSQL_SECRET,
  database        : process.env.MYSQL_DB
})

const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: 'fundasoft',
  port: process.env.RDS_PORT,
});


router.get('/', function (req , res) {
  const userId = req.query.user;

  connection.query(
    `SELECT * FROM tasks WHERE user = ${userId}`,
    function (error, results) {
      console.log(error);
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
  const userId = req.query.user;
  const taskId = parseInt(req.params.taskId);

  connection.query(
    `DELETE FROM tasks WHERE id = ${taskId} AND user = ${userId}`,
    function (error, results) {
      if (error) res.status(500).send('No se pudo eliminar la tarea.');

      res.status(200).send(`Se eliminó la tarea ${taskId}`);
    }
  );
});

router.put('/:taskId', function (req, res) {
  const userId = req.query.user;
  const taskId = parseInt(req.params.taskId);
  const body = req.body;
  let updates = [];

  const validColumns = ['description', 'done', 'user'];

  validColumns.map(column => {
    if (body[column] !== undefined) {
      updates.push(`${column} = '${body[column]}'`);
    }
  });

  const queryUpdates = updates.join(', ');

  connection.query(
    `UPDATE tasks SET ${queryUpdates} WHERE user = ${userId} AND id = ${taskId}`,
    function (error, results) {
      if (error) res.status(500).send('No se pudo actualizar la tarea.');

      res.status(200).send(`La tarea ${taskId} se actualizó correctamente`);
    }
  );
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
