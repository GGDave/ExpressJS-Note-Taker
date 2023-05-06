const express = require("express"); // this line allows us to use import the express modules
const path = require('path'); //allows us to easily reference and work with our file paths
const fs = require('fs');
const uuid = require('./helpers/uuid');
const  PORT = process.env.PORT || 3001; // this line of code sets a default port to be 3001,
// process.env.PORT allows node js to switch to the an available port if 3001 is taken.
const app = express() //setting a constant to equal express allows us to use the the many methods express provides.
// const uuid = require() // allows us to generate unique ID

app.use(express.json());// this line of code allows us to handle json data
app.use(express.urlencoded({ extended: true }));// this line of code allows us to handle urlencoded data
app.use(express.static("public")); // this line of code allows us to automatically build a route for the contents inside the public folder.

app.get("/index", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

//lines 22-27 allows us to retrieve thr db.json file
const util = require('util');
const readFromFile = util.promisify(fs.readFile);

app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for db`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

const writeFileAsync = (path, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

app.post('/api/notes', (req, res) => {
  readFromFile('./db/db.json')
    .then((data) => {
      const dbJson = JSON.parse(data);
      const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuid(),
      };
      dbJson.push(newNote);
      return writeFileAsync('./db/db.json', JSON.stringify(dbJson));
    })
    .then(() => readFromFile('./db/db.json'))
    .then((updatedData) => res.json(JSON.parse(updatedData)))
    .catch((err) => console.error(err));
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);// lastly this allows us to have the server continously active. 