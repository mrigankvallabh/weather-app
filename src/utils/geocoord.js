require("dotenv").config({ encoding: "utf-8" });
const utils = require("./utils");
const filename = utils.filename(__filename);
const myLogger = require("./logger");
myLogger.setLabel(filename);

/**
 * @description Finds the Coordinates of the given Address
 * @param {String} address
 * @param {Function} callback
 * @returns {Object} {longitude, latitude, place}
 */
const axios = require("axios").default;

const geoCoord = (address, callback) => {
  const mapboxApiKey = process.env.MAPBOX_API_KEY;
  const geoCodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json`;

  axios
    .get(geoCodeUrl, {
      params: {
        access_token: mapboxApiKey,
        limit: 1,
        fuzzyMatch: false
      }
    })
    .then(({ data }) => {
      // myLogger.logger.info(`Fetching co-ordinates for ${address}`);
      if (data.features.length === 0)
        callback(`Cannot Find Location: ${address}`, undefined);
      else
        callback(undefined, {
          longitude: data.features[0].center[0],
          latitude: data.features[0].center[1],
          place: data.features[0].place_name
        });
    })
    .catch(err => {
      if (err)
        myLogger.logger.error(`geoCoord: Cannot get coordinates: ${err.code}`);
    });
};

module.exports = geoCoord;
