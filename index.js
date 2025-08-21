const mongoose = require('mongoose');
const express = require('express');
const app = express();
require('dotenv').config();

//const notesRouter = require('./Routes/');
//endpoint for user
//const userRouter = require('./Routes/user.routes');

const userRoute = require("./Routes/user.routes");
const sessionRoute = require("./Routes/session.routes");
const uploadRoute = require("./Routes/upload.routes");

app.use(express.json());

// app.use("/api/users", userRoute);
app.use("/api/sessions", sessionRoute);
app.use("/api/upload", uploadRoute);

app.use("/users", userRoute)

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/AI_APP');
}
main().then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Error connecting to MongoDB", err);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
