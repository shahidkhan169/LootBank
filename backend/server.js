const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const bank = require("./router/bank");
const cors = require("cors");
const helmet = require("helmet");
require('dotenv').config();

const app = express();

app.use(cors(
  {
    origin:["http://localhost:5173"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
));
app.use(helmet());
app.use(express.json());
mongoose.connect("mongodb+srv://vibeeshn21aid:yVoFz5rMYL5wbLEv@userdata.vrirq.mongodb.net/") 
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err.message));

app.use(bank);

app.listen(3000,()=>{
  console.log("server running at port 3000");
}
)

