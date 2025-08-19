const mongoose = require('mongoose');
const express = require('express');
const app = express();
require('dotenv').config();

//const notesRouter = require('./Routes/');
//const userRouter = require('./Routes/');

const userRoute = require("./Routes/user.routes");
const sessionRoute = require("./Routes/session.routes");
const uploadRoute = require("./Routes/upload.routes");

app.use(express.json());

// app.use("/api/users", userRoute);
// app.use("/api/sessions", sessionRoute);
app.use("/api/upload", uploadRoute);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
