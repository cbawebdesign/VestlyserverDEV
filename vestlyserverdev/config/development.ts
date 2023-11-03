const CONFIG = require('dotenv').config().parsed;

/**
 * Vestly Development Config
 * config/development.js
 */

export default {
  apiUrl: 'http://localhost:3000',
  mongoDBConnectionString: CONFIG.MONGO_DB_CONNECTION_STRING_DEVELOPMENT,
  firebase: {
    credential: {
      type: 'service_account',
      project_id: 'vestlydev-a7378',
      private_key_id: '0c611ed0b6bcbb1fe234283083b640178fc82561',
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDXN3s4ra3cpgUH\nnPhcN4prRBr6XJf5VUqcwf2QAp1l9cVWgACYyyhEvuRnF1pphz9Q6hV0B1WcQR4+\n2mdB2DtJmTOMu7vuL7b4jo8FAV1le3twSndGCE8w+BKsdfByE3RrXk7o21MnL2Is\nn0mele2aKy/Vo/vdOfw2mYtA+UiFhIjrjPCib0TXVOorkyMN7CWjc3j7BbcFkNGH\n5cYM/Hpt3atCXNo1ceFE6dbg7c4yjRGCu83NBkZfvxtJc9HOPcAW3vddp9OJAPO6\nX4K8W0eXuW+swtA9GXruhOQtGzFATtrudfDfeW9HlgaFeqj7DHNae+Q+7abKGg+7\n5Q0XRH2DAgMBAAECggEABuR/fUXoSttET18CTNqSHWckFNjKgzegkptB41u6FI34\n+neFM8XtFCD0kEd2sIK4Dxk+g6WvSVHqko+/49aotQdp8VVn3bQVTSn5QATjRVp3\nJ+L/ck480jz3q1W01Cp18L30YAL6MeFggjy9u/PISGCetERl6H4wninWHftKpjMu\nSFcSyrAHCqwquRC10cJASLAXsx/yhOl5ERPfHlp6vtis6miD0TdsPE1z85vH1Hrw\nYwsVadwFOo/mjR9lMEEFb3Kr+7zWx68aB9O47Uc62KPYhhL767ZwCGCxMNrRuS4Z\noq1Sto1OQriSfaLmWMhEQt/Xo67cUX2pwPHhkZFJ3QKBgQD0s8O+Q4TBewD+U5dJ\nvTgdn89cKxQ9PHjItSahMPmDijYXqLnB/FT2FNzL6g6OuBL1CAznHTLhPeEp5uTc\nc/rEpNx/D7nwyFDMlJwh+wS4PpR0fLZIhPsVWSc7Hv985cPANx363QmAAmtGLjZm\nBfEDJtBGCwJDdrWvvqPSZE20tQKBgQDhJzc7pSfMfjjLxjJbyfS0wPB0STw/1LsM\nVGtHX52xqB6AKQtKEV7lu4xDAF6XOjpKAAXeuq1E4ssb/F4PUE7NYa1bPPXu+7xA\nHGn35hFzFF4Hxb14f3gpAw+56utF/xzhIBhngR+wn7NIF0h1lr0HfJtxeUuVoayA\ndNQgbuxEVwKBgGsEq5jsgoTzvK199W5keMRL/i47EPDvH4v33dslRhqHOb0DJ6p1\nJtswqJft10wHqRLM4Ie7N2NW4sCmoHThrEyQJXbUc+egU+YFIHukAp5pkBeZ60aw\nEfd2NDghCG+hNQk9kbkDLoJzjGL3FwdrlcphETlw2x6SLkecQp1jDLD5AoGBAJjF\nNyDtaxfB/V+m17yYR8XttDnzB0J4YYJ4NWJ0aleFL0zejJ5xMubGXuGHeqc6Bxr2\n8QSzvaWkDRSsJFZXs2CAClSCBI1nmdAWd4CRRv3CsBqt/WWpeCq7vQv1bjZMZ5gJ\nYwW4A3ygn9Emmy/OW+ycjAxutO6OiLGQk+591Sp5AoGBAKo+yJhERxsNAN2ZWBO5\nw4m7oiOEaX/deOYQqW12Ti7UzZVPtjKuHlzJdGjfQ0jb8+2hI25Q6ygFANqIOiSp\nFUYGet7x/N+787qSkUuez+2oFzHMtglfRg8z1azf/TeMmbIZdbUfWV3dGdcyVwWo\nAt7l/oV4IUnzw27CPhS4A/Df\n-----END PRIVATE KEY-----\n',
      client_email:
        'firebase-adminsdk-r84sz@vestlydev-a7378.iam.gserviceaccount.com',
      client_id: '109133927173532805249',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-r84sz%40vestlydev-a7378.iam.gserviceaccount.com',
      universe_domain: 'googleapis.com',
    },
  },
  redis: {
    host: 'localhost',
    port: 6379,
  },
  aws: {
    region: 'us-east-1',
    sqsEndpoint: 'http://localhost:4566/000000000000/',
    priceQueue: `vestly-price-${process.env.NODE_ENV}`,
  },
  xignite: { token: CONFIG.XIGNITE_TOKEN_DEVELOPMENT },
  timezone: 'America/New_York',
  isRealtimeStockPrice: false,
};
