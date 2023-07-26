const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL

mongoose.connect(MONGO_URL, {
    UseNewUrlParser: true,
    UseUndefinedTopology: true,
})
.then(() => {console.log("DB Connection Success")
.Catch(() => {console.log(err)})
});

app.listen(PORT, ()=>{
    console.log(`app listen in ${PORT}`)
});