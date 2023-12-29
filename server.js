const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const app = express();
app.use(cors({
    origin: "https://curious-platypus-651cab.netlify.app",
}));
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

app.listen(8081, () => {
    console.log("Running");
});
