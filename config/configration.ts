export default () => ({
  weatherApiKey: process.env.WEATHER_API_KEY || 'your-api-key',
  yahooClientId: process.env.YAHOO_CLIENT_ID || 'defaultId',
  yahooClientSecret: process.env.YAHOO_CLIENT_SECRET || 'defaultSecret',
});
