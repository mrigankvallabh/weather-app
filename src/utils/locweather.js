require("dotenv").config({ encoding: "utf-8" });
const utils = require("./utils");
const filename = utils.filename(__filename);
const myLogger = require("./logger");
myLogger.setLabel(filename);

/**
 * @description Returns the weather data of passed location object
 * @param {Object} {longitude, latitude, place}
 * @param {Function} callback
 * @returns {Object} {weatherTime, temperature, rainProbability}
 */
const axios = require("axios").default;

const locWeather = ({ longitude, latitude, place }, callback) => {
  const darkskyApiKey =
    process.env.DARKSKY_API_KEY || "7b4e46ebbaf7ca7ead954dedc543ff1a";
  const url = `https://api.darksky.net/forecast/${darkskyApiKey}/${latitude},${longitude}`;

  axios
    .get(url, {
      params: {
        units: "si",
        exclude: "hourly,minutely,flags"
      }
    })
    .then(({ data }) => {
      // myLogger.logger.info(`Fetching the Weather JSON data for ${place}`);
      const currentWeather = data.currently;
      const weatherTime = new Date(currentWeather.time * 1000).toLocaleString();
      const temperature = Math.round(currentWeather.temperature);
      const rainProbability = currentWeather.precipProbability * 100;
      const summary = currentWeather.summary;
      callback(undefined, {
        weatherTime,
        temperature,
        rainProbability,
        summary
      });
    })
    .catch(err => {
      if (err) callback(`locWeather: Cannot find location! ${err}`, undefined);
    });
};

module.exports = locWeather;
