const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const app = express();
// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect("mongodb+srv://user:user@cluster0.jmjfvve.mongodb.net/?retryWrites=true&w=majority").then(() => {
    console.log("DB Connected Suceesfuly")
}).catch(err => {
    console.log(err)
})





const routes = require("./Routes/routes")
app.use("/api/v1", routes)

app.listen(process.env.PORT || 8081, () => {
    console.log("Running");
});
