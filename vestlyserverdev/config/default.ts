const CONFIG = require('dotenv').config().parsed;

export default {
  company: {
    name: 'IMOR Inc',
    address: '30 Chatham Rd, Box G, Short Hills NJ 07078',
  },
  brand: {
    name: 'Vestly',
    url: 'https://vestly.app',
    logoPurple:
      'https://imor-vestly-static.s3.amazonaws.com/brand/vestly-logo-purple.png',
  },
  client: {
    build: process.env.NODE_ENV === 'production' ? 'vestly' : 'vestlyqa',
    ios: {
      name: 'ios',
      shortName: 'i',
      version: '0.9',
    },
    android: {
      name: 'android',
      shortName: 'a',
      version: '0.9',
    },
  },
  twillio: {
    authToken: CONFIG.TWILLIO_AUTH_TOKEN,
    sid: CONFIG.TWILLIO_SID,
  },

  // PORTFOLIO
  startValue: 1000,

  // MOMENT-TIMEZONE
  mongoDateFormat: 'YYYY-mm-ddTHH:MM:ss',
  dateFormat: 'YYYY-MM-DDTHH:mm:ss[Z]',
  maxPortfolioAssets: 100,
  phoneNumberForTesting: CONFIG.DEV_PHONE_NUMBER,
};
