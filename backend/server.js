const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const bank = require("./router/bank");
const cors = require("cors");
const helmet = require("helmet");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
const mongoUrl = "mongodb+srv://shahid1692004:rbaPyVM1wWINI3hz@lootbank.wlmtn.mongodb.net/?retryWrites=true&w=majority&appName=LootBank";

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err.message));

app.use(bank);

app.listen(3000,()=>{
  console.log("server running at port 3000");
}
)

