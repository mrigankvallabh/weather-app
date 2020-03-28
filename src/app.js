require("dotenv").config({ encoding: "utf-8" });
const utils = require("./utils/utils");
const path = require("path");
const express = require("express");
const app = express();
const hbs = require("hbs");
// Define Paths
const appRootDir = path.join(__dirname, "..");
const publicDir = path.join(appRootDir, "public");
const partialsDir = path.join(app.get("views"), "partials");
const myLogger = require("./utils/logger");
const filename = utils.filename(__filename);

myLogger.setLabel(filename);
const geoCoord = require("./utils/geocoord");
const locWeather = require("./utils/locweather");

// handlebars settings
hbs.registerPartials(partialsDir);
// App Settings
let port;
app.set("port", port || 3000);
app.set("view engine", "hbs");
app.use(express.static(publicDir));
// Routes
app.get("/", (req, res) => {
  res.render("index", {
    breadcrumb: "Home",
    pageTitle: "Weather App",
    author: "Mrigank V"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    breadcrumb: "About",
    pageTitle: "About Me",
    author: "Mrigank V"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    breadcrumb: "help",
    pageTitle: "Help",
    helpText: "Enter a location to get current weather",
    author: "Mrigank V"
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) return res.send({ error: "Address is required" });

  geoCoord(req.query.address, (error, coords) => {
    if (error) {
      myLogger.logger.error(error);
      res.send({ error });
    }
    locWeather(coords, (error, forecast) => {
      if (error) {
        myLogger.logger.error(error);
        res.send({ error });
      }
      // console.log(forecast);
      res.send({ location: coords.place, forecast: forecast });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    breadcrumb: "Error 404",
    error404Text: "Help article not found"
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    breadcrumb: "Error 404",
    error404Text: "Page not found"
  });
});

port = app.get("port");
app.listen(port, () => console.log(`Express Server running on port ${port}`));
