/**
 * Xignite Service
 * services/xignite.service.js
 *
 * Shared xignite functions
 *
 */

import config from '../../config';

import Async from 'async';
import Axios from 'axios';
import _ from 'lodash';

import Moment from '../components/moment';
import Util from '../components/utils';

// const TimeService = require('./time.service');

const _xigniteToken = config.xignite.token;

/**
 * For a given symbol, return the 15 minute delayed pricing information
 * @param {string} symbol - company ticker symbol
 * @param {object} options - request options
 * @returns {object}
 */
async function getSuperQuote(
  identifier: string,
  options?: { timeout: number; retry: { times: number; interval: number } }
) {
  const timeout = options && options.timeout ? options.timeout : 2500;
  const retryTimes =
    options && options.retry && options.retry.times ? options.retry.times : 3;
  const retryInterval =
    options && options.retry && options.retry.interval
      ? options.retry.interval
      : 50;

  return Async.retry(
    { times: retryTimes, interval: retryInterval },
    function (cb: (error: any, data?: any) => void) {
      Axios({
        url: 'https://superquotes.xignite.com/xSuperQuotes.json/GetQuote',
        method: 'GET',
        timeout: timeout,
        params: {
          IdentifierType: 'Symbol',
          Identifier: identifier,
          _token: _xigniteToken,
        },
      })
        .then((response) => {
          if (!response.data) {
            return cb(
              ` 'Error calling XigniteSuperQuotes for symbol:',
              ${identifier}`
            );
          }

          if (response.data && response.data.Outcome !== 'Success') {
            return cb(`${response.data.Message}, 'for symbol:', ${identifier}`);
          }

          // Convert object to camel case
          const data = Util.objectKeysToCamelCase(response.data);

          return cb(null, data);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  );
}

// /**
//  * For an array of symbols, return the 15 minute delayed pricing information
//  * @param {array} symbols - an array of ticker symbols
//  * @returns {array}
//  */
// async function getGlobalDelayedQuotes(symbols) {
//   const joinedSymbols = symbols.join(',');

//   return Async.retry({ times: 3, interval: 50 }, function (cb) {
//     Axios({
//       url: 'https://globalquotes.xignite.com/v3/xGlobalQuotes.json/GetGlobalDelayedQuotes',
//       method: 'GET',
//       timeout: 5000,
//       params: {
//         IdentifierType: 'Symbol',
//         Identifiers: joinedSymbols,
//         _token: _xigniteToken,
//       },
//     })
//       .then((response) => {
//         if (
//           response.status !== 200 ||
//           !response.data ||
//           !_.isArray(response.data)
//         ) {
//           return cb(
//             Boom.serverUnavailable('Error calling getGlobalDelayedQuotes', {
//               symbol: symbols,
//               status: response.status,
//             })
//           );
//         }

//         // Convert collection to camel case
//         const data = Util.collectionObjectKeysToCamelCase(response.data);

//         return cb(null, data);
//       })
//       .catch((err) => {
//         return cb(err);
//       });
//   });
// }

// /**
//  * For a given symbol, return the historical pricing data
//  * @param {string} symbol - company ticker symbol
//  * @param {date} date - the date in M/D/YYYY format
//  * @returns {object}
//  */
// async function getGlobalHistoricalQuotes(symbol, date) {
//   return Async.retry({ times: 3, interval: 50 }, function (cb) {
//     Axios({
//       url: 'https://globalhistorical.xignite.com/v3/xGlobalHistorical.json/GetGlobalHistoricalQuotes',
//       method: 'GET',
//       timeout: 5000,
//       params: {
//         IdentifierType: 'Symbol',
//         Identifiers: symbol,
//         IdentifierAsOfDate: '',
//         AsOfDate: date,
//         AdjustmentMethod: 'All',
//         _token: _xigniteToken,
//       },
//     })
//       .then((response) => {
//         if (!response.data) {
//           return cb(
//             Boom.serverUnavailable('Error calling getGlobalHistoricalQuote', {
//               symbol: symbol,
//             })
//           );
//         }

//         if (
//           response.data &&
//           response.data[0] &&
//           response.data[0].Outcome !== 'Success'
//         ) {
//           return cb(
//             Boom.serverUnavailable(response.data[0].Message, {
//               response: response.data,
//               symbol: symbol,
//               date: date,
//             })
//           );
//         }

//         // Convert object to camel case
//         const data = Util.objectKeysToCamelCase(response.data[0]);

//         // Normalize data
//         if (data && data.historicalQuote) {
//           data.historicalQuote.date = Moment(
//             data.historicalQuote.date,
//             'YYYY-MM-DD'
//           ).format('M/D/YYYY');
//           data.historicalQuote.previousCloseDate = Moment(
//             data.historicalQuote.previousCloseDate,
//             'YYYY-MM-DD'
//           ).format('M/D/YYYY');
//         }

//         return cb(null, data);
//       })
//       .catch((err) => {
//         return cb(err);
//       });
//   });
// }

// /**
//  * For a given time and symbol, return the volume weighted average price (VWAP)
//  * @param {string} symbol - company ticker symbol
//  * @param {moment} moment - the time at which the trade occured
//  * @returns {object}
//  */
// async function getGlobalIntradayVWAP(symbol, m) {
//   const startTime = m.clone().subtract(5, 's');
//   const endTimeFormatted = m.format('M/D/YYYY h:mm:ssa');
//   let retryCount = 0;

//   return Async.retry({ times: 5, interval: 250 }, function (cb) {
//     Axios({
//       url: 'https://globalquotes.xignite.com/v3/xGlobalQuotes.json/GetGlobalIntradayVWAP',
//       method: 'GET',
//       timeout: 10000,
//       params: {
//         IdentifierType: 'Symbol',
//         Identifier: symbol,
//         StartTime: startTime.format('M/D/YYYY h:mm:ssa'),
//         EndTime: endTimeFormatted,
//         _token: _xigniteToken,
//       },
//     })
//       .then((response) => {
//         if (!response.data) {
//           return cb(
//             Boom.serverUnavailable('Error calling getExtendedQuote', {
//               symbol: symbol,
//             })
//           );
//         }

//         if (
//           !response.data ||
//           response.data.Outcome === 'RequestError' ||
//           !response.data.VWAP
//         ) {
//           retryCount += retryCount && retryCount > 100 ? 100 : 10;
//           startTime.subtract(retryCount, 's');
//           return cb(response.data);
//         }

//         // Convert object to camel case
//         const data = Util.objectKeysToCamelCase(response.data);

//         return cb(null, data);
//       })
//       .catch((err) => {
//         return cb(err);
//       });
//   })
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       if (err && err.Outcome !== 'Success') {
//         throw Boom.serverUnavailable(err.Message, {
//           response: err,
//           symbol: symbol,
//           m: m.format(),
//         });
//       } else {
//         throw err;
//       }
//     });
// }

// /**
//  * For a given symbol, return the real time pricing information
//  * @param {string} symbol - company ticker symbol
//  * @param {object} options - request options
//  * @returns {object}
//  */
// async function getRealQuote(symbol, options) {
//   const timeout = options && options.timeout ? options.timeout : 2500;
//   const retryTimes =
//     options && options.retry && options.retry.times ? options.retry.times : 3;
//   const retryInterval =
//     options && options.retry && options.retry.interval
//       ? options.retry.interval
//       : 50;

//   return Async.retry(
//     { times: retryTimes, interval: retryInterval },
//     function (cb) {
//       Axios({
//         url: 'https://batsrealtime.xignite.com/xBATSRealTime.json/GetRealQuote',
//         method: 'GET',
//         timeout: timeout,
//         params: {
//           Symbol: symbol,
//           _token: _xigniteToken,
//         },
//       })
//         .then((response) => {
//           if (!response.data) {
//             return cb(
//               Boom.serverUnavailable('Error calling getRealQuote', {
//                 symbol: symbol,
//               })
//             );
//           }

//           if (response.data && response.data.Outcome !== 'Success') {
//             return cb(
//               Boom.serverUnavailable(response.data.Message, {
//                 response: response.data,
//                 symbol: symbol,
//               })
//             );
//           }

//           // Convert object to camel case
//           const data = Util.objectKeysToCamelCase(response.data);

//           return cb(null, data);
//         })
//         .catch((err) => {
//           return cb(err);
//         });
//     }
//   );
// }

// /**
//  * For a given symbol, return the real time extended pricing information
//  * @param {string} symbol - company ticker symbol
//  * @param {object} options - request options
//  * @returns {object}
//  */
// async function getExtendedQuote(symbol, options) {
//   const timeout = options && options.timeout ? options.timeout : 2500;
//   const retryTimes =
//     options && options.retry && options.retry.times ? options.retry.times : 3;
//   const retryInterval =
//     options && options.retry && options.retry.interval
//       ? options.retry.interval
//       : 50;

//   return Async.retry(
//     { times: retryTimes, interval: retryInterval },
//     function (cb) {
//       Axios({
//         url: 'https://batsrealtime.xignite.com/xBATSRealTime.json/GetExtendedQuote',
//         method: 'GET',
//         timeout: timeout,
//         params: {
//           Symbol: symbol,
//           _token: _xigniteToken,
//         },
//       })
//         .then((response) => {
//           if (!response.data) {
//             return cb(
//               Boom.serverUnavailable('Error calling getExtendedQuote', {
//                 symbol: symbol,
//               })
//             );
//           }

//           if (response.data && response.data.Outcome !== 'Success') {
//             return cb(
//               Boom.serverUnavailable(response.data.Message, {
//                 response: response.data,
//                 symbol: symbol,
//               })
//             );
//           }

//           // Convert object to camel case
//           const data = Util.objectKeysToCamelCase(response.data);

//           return cb(null, data);
//         })
//         .catch((err) => {
//           return cb(err);
//         });
//     }
//   );
// }

// /**
//  * For an array of symbols, return the real time pricing information
//  * @param {array} symbols - an array of ticker symbols
//  * @returns {array}
//  */
// async function getExtendedQuotes(symbols) {
//   const joinedSymbols = symbols.join(',');

//   return Async.retry({ times: 3, interval: 50 }, function (cb) {
//     Axios({
//       url: 'https://batsrealtime.xignite.com/xBATSRealTime.json/GetExtendedQuotes',
//       method: 'GET',
//       timeout: 5000,
//       params: {
//         Symbols: joinedSymbols,
//         _token: _xigniteToken,
//       },
//     })
//       .then((response) => {
//         if (
//           response.status !== 200 ||
//           !response.data ||
//           !_.isArray(response.data)
//         ) {
//           return cb(
//             Boom.serverUnavailable('Error calling getExtendedQuotes', {
//               symbol: symbols,
//               status: response.status,
//             })
//           );
//         }

//         // Convert collection to camel case
//         const data = Util.collectionObjectKeysToCamelCase(response.data);

//         return cb(null, data);
//       })
//       .catch((err) => {
//         return cb(err);
//       });
//   });
// }

// /**
//  * List exchanges
//  * @returns {array} - array of exchanges
//  */
// async function listExchanges() {
//   return Axios({
//     url: 'https://globalquotes.xignite.com/v3/xGlobalQuotes.json/ListExchanges',
//     method: 'GET',
//     params: {
//       _token: _xigniteToken,
//     },
//   }).then((response) => {
//     if (!response.data) {
//       throw new Error('No response data received');
//     }

//     if (response.data && response.data.Outcome !== 'Success') {
//       throw new Error(response.data.Message);
//     }

//     // Convert collection to camel case
//     const data = Util.collectionObjectKeysToCamelCase(
//       response.data.ExchangeDescriptions
//     );

//     return data;
//   });
// }

// /**
//  * List symbols for an exchange
//  * @param {string} exchangeIdentifier - exchange identifier
//  * @returns {array} - a collection of symbols
//  */
// async function listSymbols(exchangeIdentifier) {
//   return Axios({
//     url: 'https://globalquotes.xignite.com/v3/xGlobalQuotes.json/ListSymbols',
//     method: 'GET',
//     params: {
//       Exchange: exchangeIdentifier,
//       StartSymbol: '',
//       EndSymbol: '',
//       _token: _xigniteToken,
//     },
//   }).then((response) => {
//     if (!response.data) {
//       throw new Error('No response data received');
//     }

//     if (response.data && response.data.Outcome !== 'Success') {
//       throw new Error(response.data.Message);
//     }

//     // Convert collection to camel case
//     let data = Util.collectionObjectKeysToCamelCase(
//       response.data.SecurityDescriptions
//     );

//     // Normalize symbols
//     data = _normalizeSymbols(data);

//     return data;
//   });
// }

// /**
//  * List symbol changes for an exchange
//  * @param {string} exchangeIdentifier - exchange identifier
//  * @param {string} changesSince - changes since date
//  * @returns {array} - a collection of symbol changes
//  */
// async function listSymbolChanges(exchangeIdentifier, changesSince) {
//   return Axios({
//     url: 'https://globalquotes.xignite.com/v3/xGlobalQuotes.json/ListSymbolChanges',
//     method: 'GET',
//     params: {
//       Exchange: exchangeIdentifier,
//       ChangesSince: changesSince,
//       _token: _xigniteToken,
//     },
//   }).then((response) => {
//     if (!response.data) {
//       throw new Error('No response data received');
//     }

//     if (
//       response.data &&
//       response.data.Message ===
//         `No data available for this Exchange (${exchangeIdentifier}).`
//     ) {
//       return [];
//     }

//     if (response.data && response.data.Outcome !== 'Success') {
//       throw new Error(response.data.Message);
//     }

//     // Convert collection to camel case
//     let data = Util.collectionObjectKeysToCamelCase(
//       response.data.SymbolChanges
//     );

//     // Normalize symbols
//     data = _normalizeSymbols(data);

//     return data;
//   });
// }

// /**
//  * List companies for an exchange
//  * @param {string} exchangeIdentifier - exchange identifier
//  * @returns {array} - a collection of symbols
//  */
// async function listCompanies(exchangeIdentifier) {
//   return Axios({
//     url: 'https://factsetfundamentals.xignite.com/xFactSetFundamentals.json/ListCompanies',
//     method: 'GET',
//     params: {
//       MarketIdentificationCode: exchangeIdentifier,
//       StartSymbol: '',
//       EndSymbol: '',
//       _token: _xigniteToken,
//     },
//   }).then((response) => {
//     if (!response.data) {
//       throw new Error('No response data received');
//     }

//     if (response.data && response.data.Outcome !== 'Success') {
//       throw new Error(response.data.Message);
//     }

//     // Convert collection to camel case
//     let data = Util.collectionObjectKeysToCamelCase(response.data.Companies);

//     // Normalize symbols
//     data = _normalizeSymbols(data);

//     return data;
//   });
// }

// /**
//  * Get adjustment factors for a symbol
//  * @param {string} symbol - the company symbol
//  * @param {string} startDate - start date as M/D/YYYY
//  * @param {string} endDate - end date as M/D/YYYY
//  * @returns {array} - array of adjustment factors
//  */
// async function getAdjustmentFactors(symbol, startDate, endDate) {
//   return Async.retry({ times: 3, interval: 250 }, function (cb) {
//     return Axios({
//       url: 'https://globalhistorical.xignite.com/v3/xGlobalHistorical.json/GetAdjustmentFactors',
//       method: 'GET',
//       timeout: 15000,
//       params: {
//         IdentifierType: 'Symbol',
//         Identifier: symbol,
//         StartDate: startDate,
//         EndDate: endDate,
//         _token: _xigniteToken,
//       },
//     })
//       .then((response) => {
//         if (!response.data) {
//           return cb(new Error('No response data received'));
//         }

//         if (response.data && response.data.Outcome !== 'Success') {
//           return cb(new Error(response.data.Message));
//         }

//         const data = {
//           security: null,
//           arrayOfAdjustmentFactor: [],
//         };

//         if (response.data.Security) {
//           // Convert object to camel case
//           data.security = Util.objectKeysToCamelCase(response.data.Security);
//         }

//         if (response.data.ArrayOfAdjustmentFactor) {
//           // Convert collection to camel case
//           data.arrayOfAdjustmentFactor = Util.collectionObjectKeysToCamelCase(
//             response.data.ArrayOfAdjustmentFactor
//           );
//         }

//         return cb(null, data);
//       })
//       .catch((err) => {
//         return cb(err);
//       });
//   });
// }

// /**
//  * Get dividends by exchange
//  * @param {string} exchangeIdentifier - exchange identifier
//  * @param {string} exDate - the exdate to retrieve dividends for
//  * @returns {array} - array of splits
//  */
// async function getCashDividendsByExchange(exchangeIdentifier, exDate) {
//   return Async.retry({ times: 10, interval: 1000 }, function (cb) {
//     return Axios({
//       url: 'https://globalhistorical.xignite.com/v3/xGlobalHistorical.json/GetCashDividendsByExchange',
//       method: 'GET',
//       timeout: 15000,
//       params: {
//         Exchange: exchangeIdentifier,
//         ExDate: exDate,
//         CorporateActionsAdjusted: 'True',
//         _token: _xigniteToken,
//       },
//     })
//       .then((response) => {
//         if (!response.data) {
//           return cb(new Error('No response data received'));
//         }

//         if (response.data && response.data.Outcome !== 'Success') {
//           return cb(new Error(response.data.Message));
//         }

//         let data = [];

//         if (response.data.ExchangeDividends) {
//           // Convert collection to camel case
//           data = Util.collectionObjectKeysToCamelCase(
//             response.data.ExchangeDividends
//           );
//         }

//         return cb(null, data);
//       })
//       .catch((err) => {
//         return cb(err);
//       });
//   });
// }

// /**
//  * Get splits by exchange
//  * @param {string} exchangeIdentifier - exchange identifier
//  * @param {string} exDate - the exdate to retrieve splits for
//  * @returns {array} - array of splits
//  */
// async function getSplitsByExchange(exchangeIdentifier, exDate) {
//   return Async.retry({ times: 10, interval: 1000 }, function (cb) {
//     return Axios({
//       url: 'https://globalhistorical.xignite.com/v3/xGlobalHistorical.json/GetSplitsByExchange',
//       method: 'GET',
//       timeout: 15000,
//       params: {
//         Exchange: exchangeIdentifier,
//         ExDate: exDate,
//         _token: _xigniteToken,
//       },
//     })
//       .then((response) => {
//         if (!response.data) {
//           return cb(new Error('No response data received'));
//         }

//         if (response.data && response.data.Outcome !== 'Success') {
//           return cb(new Error(response.data.Message));
//         }

//         let data = [];

//         if (response.data.ExchangeSplits) {
//           // Convert collection to camel case
//           data = Util.collectionObjectKeysToCamelCase(
//             response.data.ExchangeSplits
//           );
//         }

//         return cb(null, data);
//       })
//       .catch((err) => {
//         return cb(err);
//       });
//   });
// }

// /**
//  * Get latest fundamentals
//  * @param {string} valoren
//  * @returns {object}
//  */
// async function getLatestFundamentals(valoren, options) {
//   const timeout = options && options.timeout ? options.timeout : 2500;
//   const retryTimes =
//     options && options.retry && options.retry.times ? options.retry.times : 3;
//   const retryInterval =
//     options && options.retry && options.retry.interval
//       ? options.retry.interval
//       : 50;

//   return Async.retry(
//     { times: retryTimes, retryInterval: retryInterval },
//     function (cb) {
//       return Axios({
//         url: 'https://factsetfundamentals.xignite.com/xFactSetFundamentals.json/GetLatestFundamentals',
//         method: 'GET',
//         timeout: timeout,
//         params: {
//           IdentifierType: 'Valoren',
//           Identifiers: valoren,
//           FundamentalTypes:
//             'NumberOfEmployees,CEO,MarketCapitalization,AverageDailyVolumeLast10Days,AverageDailyVolumeLast20Days,Website,CompanyName,BusinessDescription,InstrumentClass,SectorName',
//           UpdatedSince: '',
//           _token: _xigniteToken,
//         },
//       })
//         .then((response) => {
//           if (!response.data || !response.data[0]) {
//             return cb(new Error('No response data received'));
//           }

//           if (response.data[0].Outcome !== 'Success') {
//             return cb(new Error(response.data[0].Message));
//           }

//           if (
//             !response.data[0].FundamentalsSets ||
//             !response.data[0].FundamentalsSets[0] ||
//             !response.data[0].Company
//           ) {
//             return cb(new Error(`No fundamentals found for ${valoren}`));
//           }

//           const company = Util.objectKeysToCamelCase(response.data[0].Company);
//           const fundamentals = {};
//           _.each(response.data[0].FundamentalsSets[0].Fundamentals, (f) => {
//             if (f.Type === 'MarketCapitalization' && _.isString(f.Value)) {
//               if (f.Unit === 'Millions') {
//                 fundamentals[_.camelCase(f.Type)] =
//                   parseFloat(f.Value) * 1000000;
//               } else {
//                 Log.warn(
//                   {
//                     valoren: valoren,
//                     fundamentals: f,
//                   },
//                   'Marketcap unit not in millions'
//                 );
//               }
//             } else if (_.isString(f.Value) && f.Value.length > 1) {
//               fundamentals[_.camelCase(f.Type)] = f.Value;
//             }
//           });

//           const data = {
//             asOfDate: Moment(
//               response.data[0].FundamentalsSets[0].AsOfDate,
//               'M/D/YYYY'
//             ).format('YYYY-MM-DD'),
//             company: company,
//             fundamentals: fundamentals,
//             fundamentalsCount: _.size(fundamentals),
//           };

//           return cb(null, data);
//         })
//         .catch((err) => {
//           return cb(err);
//         });
//     }
//   );
// }

// /**
//  * Get top market movers by type
//  * @param {string} marketMoverType - MostActive, PercentGainers, PercentLosers
//  * @returns {array}
//  */
// async function getTopMarketMovers(marketMoverType) {
//   return Async.retry({ times: 3, interval: 100 }, function (cb) {
//     return Axios({
//       url: 'https://globalquotes.xignite.com/v3/xGlobalQuotes.json/GetTopMarketMovers?Exchanges=XNYS,XNAS',
//       method: 'GET',
//       timeout: 15000,
//       params: {
//         MarketMoverType: marketMoverType,
//         NumberOfMarketMovers: 50,
//         Exchanges: 'XNYS,XNAS',
//         _token: _xigniteToken,
//       },
//     })
//       .then((response) => {
//         if (!response.data) {
//           return cb(new Error('No response data received'));
//         }

//         if (response.data && response.data.Outcome !== 'Success') {
//           return cb(new Error(response.data.Message));
//         }

//         let data = [];

//         if (response.data.Movers) {
//           // Convert collection to camel case
//           data = Util.collectionObjectKeysToCamelCase(response.data.Movers);
//         }

//         return cb(null, data);
//       })
//       .catch((err) => {
//         return cb(err);
//       });
//   });
// }

// /**
//  * List all earnings calendar items
//  * @returns {array}
//  */
// async function getEarningCalendarDay(asOfDate) {
//   return Async.retry({ times: 3, interval: 1000 }, function (cb) {
//     return Axios({
//       url: 'https://www.xignite.com/xEarningsCalendar.json/GetEarningCalendarDay',
//       method: 'GET',
//       timeout: 15000,
//       params: {
//         AsOfDate: Moment(asOfDate, 'YYYY-MM-DD').format('M/D/YYYY'),
//         MinimumMarketCap: 10,
//         _token: _xigniteToken,
//       },
//     })
//       .then((response) => {
//         if (!response.data) {
//           return cb(new Error('No response data received'));
//         }

//         if (response.data && response.data.Outcome !== 'Success') {
//           return cb(new Error(response.data.Message));
//         }

//         let data = [];

//         if (response.data.Announcements) {
//           // Convert collection to camel case
//           data = Util.collectionObjectKeysToCamelCase(
//             response.data.Announcements
//           );
//         }

//         return cb(null, data);
//       })
//       .catch((err) => {
//         return cb(err);
//       });
//   });
// }

// /**
//  * Get a set of summarized realtime quote bars for a given time range across multiple days, with up to 30 days of history.
//  * @param {string} symbol
//  * @param {string} precision - "minutes" or "hours"
//  * @param {number} period
//  * @param {moment} startTime
//  * @param {moment} endTime
//  * @returns {array}
//  */
// async function getRealtimeBars(symbol, precision, period, startTime, endTime) {
//   const startTimeFormatted = startTime.format('MM/DD/YYYY HH:mm');
//   const endTimeFormatted = endTime.format('MM/DD/YYYY HH:mm');

//   return Async.retry({ times: 3, interval: 100 }, function (cb) {
//     return Axios({
//       url: 'https://batsrealtime.xignite.com/xBATSRealTime.json/GetBars',
//       method: 'GET',
//       timeout: 15000,
//       params: {
//         Symbol: symbol,
//         StartTime: startTimeFormatted,
//         EndTime: endTimeFormatted,
//         Precision: precision,
//         Period: period,
//         _token: _xigniteToken,
//       },
//     })
//       .then((response) => {
//         if (!response.data) {
//           return cb(
//             Boom.serverUnavailable('Error calling getBar', {
//               symbol: symbol,
//             })
//           );
//         }

//         if (response.data && response.data.Outcome !== 'Success') {
//           return cb(
//             Boom.serverUnavailable(response.data.Message, {
//               response: response.data,
//               symbol: symbol,
//             })
//           );
//         }

//         // Convert collection to camel case
//         const data = Util.collectionObjectKeysToCamelCase(response.data.Bars);

//         return cb(null, data);
//       })
//       .catch((err) => {
//         return cb(err);
//       });
//   });
// }

// /**
//  * Get a set of summarized delayed quote bars for a given time range across multiple days, with up to 30 days of history.
//  * @param {string} symbol
//  * @param {string} precision - "minutes" or "hours"
//  * @param {number} period
//  * @param {moment} startTime
//  * @param {moment} endTime
//  * @returns {array}
//  */
// async function getDelayedBars(symbol, precision, period, startTime, endTime) {
//   const startTimeFormatted = startTime.format('MM/DD/YYYY HH:mm');
//   const endTimeFormatted = endTime.format('MM/DD/YYYY HH:mm');

//   return Async.retry({ times: 3, interval: 100 }, function (cb) {
//     return Axios({
//       url: 'https://globalquotes.xignite.com/v3/xGlobalQuotes.json/GetBars',
//       method: 'GET',
//       timeout: 15000,
//       params: {
//         IdentifierType: 'Symbol',
//         Identifier: symbol,
//         StartTime: startTimeFormatted,
//         EndTime: endTimeFormatted,
//         Precision: precision,
//         Period: period,
//         _token: _xigniteToken,
//       },
//     })
//       .then((response) => {
//         if (!response.data) {
//           return cb(
//             Boom.serverUnavailable('Error calling getBar', {
//               symbol: symbol,
//             })
//           );
//         }

//         if (response.data && response.data.Outcome !== 'Success') {
//           return cb(
//             Boom.serverUnavailable(response.data.Message, {
//               response: response.data,
//               symbol: symbol,
//             })
//           );
//         }

//         // Convert collection to camel case
//         const data = Util.collectionObjectKeysToCamelCase(response.data.Bars);

//         return cb(null, data);
//       })
//       .catch((err) => {
//         return cb(err);
//       });
//   });
// }

// /**
//  * Normalize symbols from Xignite to . convention instead of /
//  * @param {array} collection - collection of objects containing symbols
//  * @returns {array} - collection of objects with normalized symbols
//  */
// function _normalizeSymbols(collection) {
//   return _.map(collection, (i) => {
//     if (i.symbol) {
//       i.symbol = _.replace(i.symbol, '/', '.');
//     }

//     if (i.oldSymbol) {
//       i.oldSymbol = _.replace(i.oldSymbol, '/', '.');
//     }

//     return i;
//   });
// }

export default {
  getSuperQuote,
  // getGlobalDelayedQuotes,
  // getGlobalHistoricalQuotes,
  // getGlobalIntradayVWAP,
  // getRealQuote,
  // getExtendedQuote,
  // getExtendedQuotes,
  // listExchanges,
  // listSymbols,
  // listSymbolChanges,
  // listCompanies,
  // getAdjustmentFactors,
  // getCashDividendsByExchange,
  // getSplitsByExchange,
  // getLatestFundamentals,
  // getTopMarketMovers,
  // getEarningCalendarDay,
  // getRealtimeBars,
  // getDelayedBars,
};
