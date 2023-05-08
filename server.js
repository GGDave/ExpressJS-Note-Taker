const express = require("express"); // this line allows us to use import the express modules
const path = require('path'); //allows us to easily reference and work with our file paths
const fs = require('fs');
const uuid = require('./utils/uuid');
const  PORT = process.env.PORT || 3001; // this line of code sets a default port to be 3001,
// process.env.PORT allows node js to switch to the an available port if 3001 is taken.
const app = express() //setting a constant to equal express allows us to use the the many methods express provides.
// const uuid = require() // allows us to generate unique ID

app.use(express.json());// this line of code allows us to handle json data
app.use(express.urlencoded({ extended: true }));// this line of code allows us to handle urlencoded data
app.use(express.static("public")); // this line of code allows us to automatically build a route for the contents inside the public folder.

app.get("/", (req, res) =>// this line of code will configure a path for the root file of index.html
  res.sendFile(path.join(__dirname, "/public/index.html"))
  //in the above line when a get command is initiated this line of code will trigger
  //and it will respond by sending the file we specify. path.join will allow us to work with the paths module
  //and __dirname will allow us to set a relative directory. ultimately sending a path where the file can be reached. 
);
  
app.get("/notes", (req, res) => //this line of code opperates the same as the above code but leads to a seperate file by specifying "notes"
res.sendFile(path.join(__dirname, "/public/notes.html"))
);



//lines 22-27 allows us to retrieve  db.json file
const util = require('util');// this line of code allows us to import the utils modules
const readFromFile = util.promisify(fs.readFile); // in this line of code we begin to use the util modules by using the promisify function,
//by promisyfing fs.readfile this line will return as a promise instead of a call back.

app.get('/api/notes', (req, res) => {// in this section of code we create a path to access the db.json file.
  console.info(`${req.method} request received for db`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data))); //this line of code is reading contents of db.json file and turning it into a javascript object,
  //and lastly the result is sent as a json response. responses are preffered to be in json due to ease of transfer

});

const writeFileAsync = (path, data) =>//this section of code will allow us to write data to a file using a promise.
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

app.post('/api/notes', (req, res) => { // the following section of code will allow us to update the previous information with additional information.
  readFromFile('./db/db.json') //this line will access the db.json file.
    .then((data) => { //once the file data has been accessed the fillowing code will trigger.
      const dbJson = JSON.parse(data); // here the data will be parsed meaning it will be turned to javascript format.
      const newNote = {// here we define newNote
        title: req.body.title,// here the tittle in the request body will be given the value of "tittle"
        text: req.body.text,// here the txt in the request body will be given the value of "text"
        id: uuid(),// this line will give the new note a unique id
      };
      dbJson.push(newNote); // this line will then add the new note to the db.json file
      return writeFileAsync('./db/db.json', JSON.stringify(dbJson)); // this line of code will then take the new db.json file with the new note included
      //and write it to the db.json file in the directory. 
    })
    .then(() => readFromFile('./db/db.json'))// this line will then read the file after its been updated
    .then((updatedData) => res.json(JSON.parse(updatedData))) //this line will allow the new note stored note to be seen by the user
    .catch((err) => console.error(err));//this line will log any errors to the console. 
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);// lastly this allows us to have the server continously active. 