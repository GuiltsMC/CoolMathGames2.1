const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true
}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'myapp'
});

connection.connect();

app.listen(port, () => console.log(`Server listening on port ${port}`));

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }
  
    const hashedPassword = bcrypt.hashSync(password, 10);
  
    connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Error signing up');
      }
  
      req.session.user = { id: results.insertId, email };
      res.redirect('/dashboard');
    });
  });
  