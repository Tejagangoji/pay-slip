const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const app = express();
app.use((req, res, next) => {
  const allowedOrigin = 'https://curious-platypus-651cab.netlify.app';
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials
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
