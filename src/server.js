const path = require("path");
const express = require("express");
const session = require("express-session");
const notifier = require("node-notifier");
const config = require("./config");
const db = require("./db");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(
  session({
    secret: "jako-tajan-kljuc-muahahaahaaa",
    resave: false,
    saveUninitialized: false,
  }),
);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/xss", (req, res) => {
  res.render("xss");
});

app.get("/sensitive-data", (req, res) => {
  res.render("sensitive-data", {
    loggedIn: req.session.loggedIn,
    username: req.session.username,
    password: req.session.password,
  });
});

app.post("/create", async (req, res) => {
  const { username, password, checkbox } = req.body;

  try {
    if (await db.isTaken(username)) {
      notifier.notify({
        title: "Korisničko ime je zauzeto!",
        message: "Molimo pokušajte s drugim korisničkim imenom.",
        sound: true,
        wait: true,
        icon: undefined,
        actions: ["Razumijem"],
      });
    } else {
      const user = await db.createUser(username, password, !checkbox);
      req.session.loggedIn = true;
      req.session.username = username;
    }
  } catch (err) {
    console.log(err);
  }

  res.redirect("/sensitive-data");
});

app.post("/show-pass", async (req, res) => {
  const pass = await db.getPassword(req.session.username);
  req.session.password = pass;
  res.redirect("/sensitive-data");
});

app.post("/hide-pass", (req, res) => {
  req.session.password = undefined;
  res.redirect("/sensitive-data");
});

app.post("/logout", (req, res) => {
  req.session.username = undefined;
  req.session.password = undefined;
  req.session.loggedIn = undefined;
  res.redirect("/sensitive-data");
});

app.listen(config.port, () => {
  console.log(`Aplikacija sluša na ${config.baseUrl}:${config.port}.`);
});
