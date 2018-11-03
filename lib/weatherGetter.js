const got = require('got');
const API_KEY = process.env.SWEATY_OPEN_WEATHER_API_KEY;

const TIME_FRAME = {
  NOW: 'weather',
  FORECAST: 'forecast'
};

const WEATHER_BY = {
  ZIP: 'zip=',
  CITY_BY_NAME: 'q='
};

const UNITS = {
  US: 'imperial',
  WORLD: 'metric'
};

function endpointBuilder(timeFrame, format, postalCode, countryCode, unit) {
  let un = unit;
  if (!unit) {
    un = (countryCode || 'US').toUpperCase() === 'US' ? UNITS.US : UNITS.WORLD;
  }

  if (!countryCode) {
    return `https://api.openweathermap.org/data/2.5/${timeFrame}?${format}${postalCode}&units=${un}&APPID=${API_KEY}`;
  } else {
    return `https://api.openweathermap.org/data/2.5/${timeFrame}?${format}${postalCode},${countryCode.toLowerCase()}&units=${un}&APPID=${API_KEY}`;
  }
}

// gets the weather info by zip for today
function getTodaysWeatherByZip(zip, countryCode, timeFrame) {
  return new Promise((resolve, reject) => {
    if (!Object.entries(TIME_FRAME).includes(timeFrame)) {
      // don't break the world
      timeFrame = TIME_FRAME.NOW;
    }
    got(endpointBuilder(timeFrame, WEATHER_BY.ZIP, zip, countryCode), {
      json: true
    })
      .then(res => {
        if (TIME_FRAME.NOW) {
          resolve(res.body);
        } else {
          resolve(res.body.list[0]);
        }
      })
      .catch(err => reject(err));
  });
}

module.exports = {
  byZip: getTodaysWeatherByZip,
  TIME_FRAME
};
