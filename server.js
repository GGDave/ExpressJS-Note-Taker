const express = require("express"); // this line allows us to use import the express modules
const  PORT = process.env.PORT || 3001; // this line of code sets a default port to be 3001,
// process.env.PORT allows node js to switch to the an available port if 3001 is taken.
const app = express() //setting a constant to equal express allows us to use the the many methods express provides.
const uuid = require() // allows us to generate unique ID

app.use(express.json());// this line of code allows us to handle json data
app.use(express.urlencoded({ extended: true }));// this line of code allows us to handle urlencoded data
app.use(express.static('public')); // this line of code allows us to automatically build a route for the contents inside the public folder.




app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);// lastly this allows us to have the server continously active. 