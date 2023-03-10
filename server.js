const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var cors = require('cors');
const { readFile, writeFile } = require('fs').promises;
const app = express();

var corsOptions = {
  origin: 'https://gatekeep.magic-ai.org',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app.use(express.json());
app.use(cors({ origin: 'https://gatekeep.magic-ai.org' }));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://gatekeep.magic-ai.org');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});





app.get("/api",cors(corsOptions), (req, res) => {
    res.json({"message": "Hello from server!"});
});


async function writeToJson(user) {
  try {
    const users = await readFile('./users.json', 'utf8');
    const userList = JSON.parse(users);
    userList.push(user);
    await writeFile('./users.json', JSON.stringify(userList, null, 2));
    console.log(`User ${user.username} added to users.json`);
  } catch (err) {
    console.error('Error occurred while writing to file!', err);
  }
}


async function checkUser(username) {
  try {
    const users = await readFile('./users.json', 'utf8');
    const userList = JSON.parse(users);
    const userExists = userList.some(user => user.username === username);
    return userExists;
  } catch (err) {
    console.error('Error occurred while reading directory!', err);
    return false;
  }
}


app.post("/api", cors(corsOptions), async (req, res) => {

  const data = req.body;
  const username = data.username;
  const wallAddress = data.wall_address;


  async function listDir() {
    try {
      const users = await readFile('./users.json', 'utf8');

      const userExists = await checkUser(username);
      if (userExists) {
        res.status(201).json({ message: 'User exists' });
      } else {
        const user = { username, wall_address: wallAddress };
        await writeToJson(user);
        res.status(200).json({ message: 'User added to list' });
      }
      console.log(JSON.stringify(users));
    } catch (err) {
      console.error('Error occurred while reading directory!', err);
    }
  }
  
  await listDir();

    
});
  
  

app.listen(5000, () => {console.log("server started on port 80")});