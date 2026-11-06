const path = require("path");
const express = require("express");
const config = require("./config");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(config.port, () => {
  console.log(`Aplikacija sluša na ${config.baseUrl}:${config.port}.`);
});
