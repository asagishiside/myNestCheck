export default () => ({
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  weatherApiUrl: process.env.WEATHER_API_URL || 'api-url',
  yahooClientId: process.env.YAHOO_CLIENT_ID || '',
  yahooClientSecret: process.env.YAHOO_CLIENT_SECRET || '',
  yahooApiUrl: process.env.YAHOO_API_URL || 'api-url',
});
