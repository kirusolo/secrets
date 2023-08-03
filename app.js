// jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", async function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  try {
    await newUser.save();
    res.render("secrets");
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const foundUser = await User.findOne({ email: username });
    if (foundUser && foundUser.password === password) {
      res.render("secrets"); // Render the "secrets" view
    } else {
      // Handle incorrect username or password
      console.log("Incorrect username or password");
      // Handle incorrect credentials
    }
  } catch (err) {
    // Handle any errors that occurred during the query
    console.log("Error finding user:", err);
    // Handle the error, maybe show an error message on the login page
  }
});

app.listen(4050, function () {
  console.log("server started on port 4050");
});
