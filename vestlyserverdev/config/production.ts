const CONFIG = require('dotenv').config().parsed;

/**
 * Vestly Development Config
 * config/development.js
 */

export default {
  apiUrl: '',
  mongoDBConnectionString: CONFIG.MONGO_DB_CONNECTION_STRING_PRODUCTION,
  firebase: {
    credential: {},
  },
  redis: {},
  aws: {
    region: 'us-east-1',
    sqsEndpoint: '',
    priceQueue: `vestly-price-${process.env.NODE_ENV}`,
  },
  xignite: { token: CONFIG.XIGNITE_TOKEN_PRODUCTION },
  timezone: 'America/New_York',
  isRealtimeStockPrice: true,
};
