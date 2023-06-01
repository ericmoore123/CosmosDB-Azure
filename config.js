const dotenv = require('dotenv');
dotenv.config();

let config = {}

// config.endpoint = process.env.URI;
config.endpoint = process.env.URI;
config.key = process.env.AUTH_KEY;

config.database = {
  id: 'ToDoList'
}

config.container = {
  id: 'Items'
}

config.items = {
  Eric : {
    "id": "Eric.2",
    "fName": "Eric",
    "lName": "Moore",
    "employment": [
        {
            "status": "Full-time, Permanent",
            "role": "Developer",
            "employer": "FINTRAC, GOC"
        }
    ]
  }
}

module.exports = config
