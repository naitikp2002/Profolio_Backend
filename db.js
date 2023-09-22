require('dotenv').config();
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;
// const mongoURI =
//   "mongodb+srv://naitikpatel2002:Naitik%40123@cluster0.fhqhuwl.mongodb.net/profolio?retryWrites=true&w=majority";
const connectToMongo = () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

module.exports = connectToMongo;
