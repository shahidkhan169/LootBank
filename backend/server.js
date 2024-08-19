const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const bank = require("./router/bank");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: 'https://loot-bank-frontend.vercel.app',
  methods:['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],// Replace with your React app's URL
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet());
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
module.exports=app;
