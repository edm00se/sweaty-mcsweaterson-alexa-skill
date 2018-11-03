const { byZip, TIME_FRAME } = require('./weatherGetter');

// thresholds
const THRESHOLDS = {
  TEMP: 70,
  TEMP_C: 21,
  HUMIDITY: 50
};

// returns a promise which resovles to boolean as to "will I sweat today", for provided location
function getSweatyOrNotByZipAndCountryCode(zipCode, countryCode) {
  return new Promise((resolve, reject) => {
    byZip(zipCode, countryCode, TIME_FRAME.NOW)
      .then(resp => {
        const ob = resp.main;
        const isAmericanLocale = (countryCode || 'US').toUpperCase() === 'US';
        const isHighOverTempThreshold = isAmericanLocale
          ? ob.temp_max > THRESHOLDS.TEMP
          : ob.temp_max > THRESHOLDS.TEMP_C;
        const isHumidityOverThreshold = ob.humidity > THRESHOLDS.HUMIDITY;
        if (isHighOverTempThreshold && isHumidityOverThreshold) {
          resolve({
            yn: true,
            high: ob.temp_max,
            humidity: ob.humidity
          });
        } else {
          resolve({
            yn: false,
            high: ob.temp_max,
            humidity: ob.humidity
          });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = {
  bringTowel: getSweatyOrNotByZipAndCountryCode
};
