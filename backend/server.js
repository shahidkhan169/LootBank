const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const bank = require("./router/bank");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const app = express();
require('dotenv').config();
app.use(cors());
app.use(cors({
  origin: '*', // Ensure this is correct
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(helmet());
app.use(express.json());
app.use(cookieParser());


// MongoDB connection URL
const mongoUrl = process.env.MONGO_URL;


// Connect to MongoDB
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err.message));


// Routes
app.use(bank);

// Start the server
app.listen(3000,()=>{
  console.log("server running at port 3000");
}
)

