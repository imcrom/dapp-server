const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var cors = require('cors');
const { readFile, writeFile } = require('fs').promises;
const app = express();
const app2 = express();

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



app.get("/get_users", cors(corsOptions), async (req, res) => {
  try {
    const data = await readFile("./users.json", "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error occurred while reading users file!", err);
    res.status(500).json({ error: "Unable to read users file" });
  }
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
        const user = { name: username, wall_address: wallAddress };
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


var corsOptions2 = {
  origin: 'https://dapp.dan-ai.io',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app2.use(express.json());
app2.use(cors({ origin: 'https://dapp.dan-ai.io' }));
app2.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://dapp.dan-ai.io');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app2.get("/get_users2", cors(corsOptions2), async (req, res) => {
  try {
    const data = await readFile("./dan-users.json", "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error occurred while reading users file!", err);
    res.status(500).json({ error: "Unable to read users file" });
  }
});

async function writeToJson2(user) {
  try {
    const users = await readFile('./dan-users.json', 'utf8');
    const userList = JSON.parse(users);
    userList.push(user);
    await writeFile('./dan-users.json', JSON.stringify(userList, null, 2));
    console.log(`User ${user.username} added to users.json`);
  } catch (err) {
    console.error('Error occurred while writing to file!', err);
  }
}


async function checkUser2(username) {
  try {
    const users = await readFile('./dan-users.json', 'utf8');
    const userList = JSON.parse(users);
    const userExists = userList.some(user => user.username === username);
    return userExists;
  } catch (err) {
    console.error('Error occurred while reading directory!', err);
    return false;
  }
}
  
app2.post("/apiv2", cors(corsOptions2), async (req, res) => {

  const data = req.body;
  const username = data.username;
  const wallAddress = data.wall_address;


  async function listDir() {
    try {
      const users = await readFile('./dan-users.json', 'utf8');

      const userExists = await checkUser2(username);
      if (userExists) {
        res.status(201).json({ message: 'User exists' });
      } else {
        const user = { name: username, wall_address: wallAddress };
        await writeToJson2(user);
        res.status(200).json({ message: 'User added to list' });
      }
      console.log(JSON.stringify(users));
    } catch (err) {
      console.error('Error occurred while reading directory!', err);
    }
  }
  
  await listDir();

    
});

app2.listen(5000, () => {console.log("server started on port 80")});