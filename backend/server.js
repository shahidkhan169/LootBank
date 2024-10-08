const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const bank = require("./router/bank");
const cors = require("cors");
const helmet = require("helmet");
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ["https://loot-bank-frontend.vercel.app"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(helmet());
app.use(express.json());

mongoose.connect("mongodb+srv://shahid1692004:bank1234@lootbank.wlmtn.mongodb.net/LootBank?retryWrites=true&w=majority")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err.message));

app.use(bank);

app.listen(3000, () => {
  console.log("Server running at port 3000");
});
