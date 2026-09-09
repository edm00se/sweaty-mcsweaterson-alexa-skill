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
  const normalizedUnit =
    unit ||
    ((countryCode || 'US').toUpperCase() === 'US' ? UNITS.US : UNITS.WORLD);
  const location = countryCode
    ? `${postalCode},${countryCode.toLowerCase()}`
    : postalCode;

  return `https://api.openweathermap.org/data/2.5/${timeFrame}?${format}${location}&units=${normalizedUnit}&APPID=${API_KEY}`;
}

async function getTodaysWeatherByZip(
  zip,
  countryCode,
  timeFrame = TIME_FRAME.NOW
) {
  const requestedTimeFrame =
    timeFrame === TIME_FRAME.FORECAST ? TIME_FRAME.FORECAST : TIME_FRAME.NOW;
  const endpoint = endpointBuilder(
    requestedTimeFrame,
    WEATHER_BY.ZIP,
    zip,
    countryCode
  );

  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(
      `OpenWeather request failed with status ${response.status}`
    );
  }

  const payload = await response.json();

  if (requestedTimeFrame === TIME_FRAME.FORECAST) {
    return Array.isArray(payload.list) ? payload.list[0] : payload;
  }

  return payload;
}

module.exports = {
  byZip: getTodaysWeatherByZip,
  TIME_FRAME
};
