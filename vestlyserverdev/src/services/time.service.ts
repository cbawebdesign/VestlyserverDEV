/**
 * Time Service
 * services/time.service.js
 *
 * Shared time functions
 *
 */

import { Int64 } from '@aws-sdk/types';
import config from '../../config';

import Moment from '../components/moment';

/**
 * Convert a moment to a Mongo ready UTC timestamp
 * @param {moment} [m]
 * @returns {string}
 */
function getMongoTimestamp(m?: any) {
  m = _verifyMoment(m);

  return Moment.utc(m).toDate();
}

/**
 * Convert a moment to a MySQL ready UTC date
 * @param {moment} [m]
 * @returns {string}
 */
function getMongoDate(m: any) {
  m = _verifyMoment(m);

  return Moment.utc(m).format('YYYY-MM-DD');
}

/**
 * Convert a moment to a local timezone date
 * @param {moment} [m]
 * @returns {string}
 */
function getDate(m: any) {
  m = _verifyMoment(m);

  return m.format('YYYY-MM-DD');
}

/**
 * Convert a moment to a UTC client ready timestamp
 * @param {moment} [m]
 * @returns {string}
 */
function getUtcTimestamp(m: any) {
  m = _verifyMoment(m);

  return Moment.utc(m).format(config.dateFormat);
}

/**
 * Convert a MySQL UTC timestamp to a moment object
 * @param {string} mysqlTimestamp - mysql gmt timestamp
 * @returns {moment}
 */
function convertFromGmtMysqlTimestamp(mongoTimeStamp: string) {
  return Moment.utc(mongoTimeStamp, config.mongoDateFormat).tz(config.timezone);
}

/**
 * Convert a MySQL date to a moment object
 * @param {string} mysqlDate - mysql date
 * @returns {moment}
 */
function convertFromMongoDate(mongoDate: string) {
  const date = Moment.utc(mongoDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
  return Moment(date);
}

/**
 * Helper to create a game guid
 * @param {string} gamePeriod
 * @param {string} gameType - the type of game
 * @param {string} gameLength - the length of the game
 * @returns {string}
 */
function getGameGuid(gamePeriod: string, gameType: string, gameLength: string) {
  return `${gameType}-${gameLength}-${gamePeriod}`;
}

/**
 * Helper to create a draw guid
 * @param {string} drawPeriod
 * @param {string} drawLength - the length of the draw
 * @returns {string}
 */
function getDrawGuid(drawPeriod: string, drawLength: string) {
  return `${drawLength}-${drawPeriod}`;
}

/**
 * Get the weekly draw guid from the given moment
 * @param {moment} [m]
 * @returns {string}
 */
function getWeeklyDrawGuid(m: any) {
  m = _verifyMoment(m);

  const period = getWeeklyDrawPeriod(m);
  return getDrawGuid(period, 'week');
}

/**
 * Get the monthly draw guid from the given moment
 * @param {moment} [m]
 * @returns {string}
 */
function getMonthlyDrawGuid(m: any) {
  m = _verifyMoment(m);

  const period = getMonthlyDrawPeriod(m);
  return getDrawGuid(period, 'month');
}

/**
 * Get the weekly draw period from given moment
 * @param {moment} [m]
 * @param {boolean} [asMoment] - return the value as a moment instead of string
 * @returns {string/moment}
 */
function getWeeklyDrawPeriod(m: any, asMoment: boolean = false) {
  m = _verifyMoment(m);

  m.startOf('isoWeek');

  if (asMoment) {
    return m;
  } else {
    return m.format('YYYYMMDD');
  }
}

/**
 * Get the weekly draw start time
 * @param {moment} [m]
 * @returns {moment}
 */
function getWeeklyDrawStartTime(m: any) {
  m = _verifyMoment(m);

  m.startOf('isoWeek');

  return m;
}

/**
 * Get the weekly draw end time
 * @param {moment} [m]
 * @returns {moment}
 */
function getWeeklyDrawEndTime(m: any) {
  m = _verifyMoment(m);

  m.endOf('isoWeek');

  return m;
}

/**
 * Get the monthly draw period from given moment
 * @param {moment} [m]
 * @param {boolean} [asMoment] - return the value as a moment instead of string
 * @returns {string/moment}
 */
function getMonthlyDrawPeriod(m: any, asMoment: boolean = false) {
  m = _verifyMoment(m);

  m.startOf('month');

  if (asMoment) {
    return m;
  } else {
    return m.format('YYYYMM');
  }
}

/**
 * Get the monthly draw start time
 * @param {moment} [m]
 * @returns {moment}
 */
function getMonthlyDrawStartTime(m: any) {
  m = _verifyMoment(m);

  m.startOf('month');

  return m;
}

/**
 * Get the monthly draw end time
 * @param {moment} [m]
 * @returns {moment}
 */
function getMonthlyDrawEndTime(m: any) {
  m = _verifyMoment(m);

  m.endOf('month');

  return m;
}

/**
 * Get the weekly crypto game period from the given moment
 * @param {moment} [m]
 * @param {boolean} [ignoreIsOver] - ignore the contest over check
 * @param {boolean} [asMoment] - return the value as a moment instead of string
 * @returns {string/moment}
 */
function getWeeklyCryptoGamePeriod(m: any, asMoment: boolean = false) {
  m = _verifyMoment(m);

  const startOfWeek = Moment.utc(m.utc().format())
    .startOf('isoWeek')
    .hour(12)
    .minute(0)
    .second(0)
    .milliseconds(0);

  if (asMoment) {
    return startOfWeek.tz(config.timezone);
  } else {
    return startOfWeek.format('YYYYMMDD');
  }
}

/**
 * For a given time, return the start time of the weekly crypto game.
 * @param {moment} [m]
 * @returns {moment}
 */
function getWeeklyCryptoGameStartTime(m: any) {
  m = _verifyMoment(m);

  m = Moment.utc(m.utc().format()).startOf('isoWeek').tz(config.timezone);

  return m;
}

/**
 * For a given time, return the end time of the weekly crypto game.
 * @param {moment} [m]
 * @returns {moment}
 */
function getWeeklyCryptoGameEndTime(m: any) {
  m = _verifyMoment(m);

  m = Moment.utc(m.utc().format()).endOf('isoWeek').tz(config.timezone);

  return m;
}

/**
 * Get the crypto market open time
 * @param {moment} [m]
 * @returns {moment}
 */
function getCryptoMarketOpenTime(m: any) {
  m = _verifyMoment(m);

  m = Moment.utc(m.utc().format()).startOf('day').tz(config.timezone);

  return m;
}

/**
 * For a given time, return the time that the crypto market last opened
 * @param {moment} [m]
 * @returns {moment}
 */
function getPreviousCryptoMarketOpenTime(m: any) {
  m = _verifyMoment(m);

  // If we're before market-open today, step back one day.
  if (m.isBefore(getCryptoMarketOpenTime(m))) {
    m.subtract(1, 'days');
  }

  return getCryptoMarketOpenTime(m);
}

/**
 * Get the crypto market close time
 * @param {moment} [m]
 * @returns {moment}
 */
function getCryptoMarketCloseTime(m: any) {
  m = _verifyMoment(m);

  m = Moment.utc(m.utc().format())
    .endOf('day')
    .add(1, 'second')
    .tz(config.timezone);

  return m;
}

/**
 * Get the weekly stock game period from the given moment
 * @param {moment} [m]
 * @param {boolean} [ignoreIsOver] - ignore the contest over check
 * @param {boolean} [asMoment] - return the value as a moment instead of string
 * @returns {string/moment}
 */
function getWeeklyStockGamePeriod(
  m: any,
  ignoreIsOver: boolean,
  asMoment: boolean = false
) {
  m = _verifyMoment(m);

  if (isWeeklyStockGameOver(m) && !ignoreIsOver) {
    m.startOf('isoWeek')
      .hour(9)
      .minute(0)
      .second(0)
      .milliseconds(0)
      .add(1, 'week');
  } else {
    m.startOf('isoWeek').hour(9).minute(0).second(0).milliseconds(0);
  }

  if (asMoment) {
    return m;
  } else {
    return m.format('YYYYMMDD');
  }
}

/**
 * For a given time, return the start time of the weekly stock game.
 * @param {moment} [m]
 * @returns {moment}
 */
function getWeeklyStockGameStartTime(m?: any) {
  m = _verifyMoment(m);

  m = m.clone().startOf('isoWeek');

  // If this is a holiday or weekend, go forward to the first open market day
  while (isWeekend(m) || isStockMarketHoliday(m)) {
    m.add(1, 'day');
  }

  // Get the correct close time of the market
  m = getStockMarketOpenTime(m);

  return m;
}

/**
 * For a given time, return the end time of the weekly stock game.
 * @param {moment} [m]
 * @returns {moment}
 */
function getWeeklyStockGameEndTime(m?: any) {
  m = _verifyMoment(m);

  m = m.clone().endOf('isoWeek');

  // If this is a holiday or weekend, go back to the last open market day of the month
  while (isWeekend(m) || isStockMarketHoliday(m)) {
    m.subtract(1, 'day');
  }

  // Get the correct close time of the market
  m = getStockMarketCloseTime(m);

  return m;
}

/**
 * For a given moment, return if the weekly stock game has ended
 * @param {moment} [m]
 * @returns {boolean}
 */
function isWeeklyStockGameOver(m: any) {
  m = _verifyMoment(m);

  if (m.isAfter(getWeeklyStockGameEndTime(m))) {
    return true;
  }

  return false;
}

/**
 * Check if a given time is during stock market hours
 * @param {moment} [m]
 * @returns {boolean}
 */
function isDuringStockMarketHours(m?: any) {
  m = _verifyMoment(m);

  const marketOpen = getStockMarketOpenTime(m);
  const marketClose = getStockMarketCloseTime(m);

  if (
    m.isBetween(marketOpen, marketClose) &&
    !isWeekend(m) &&
    !isStockMarketHoliday(m)
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Check if a given time is during stock price market hours
 * @param {moment} [m]
 * @returns {boolean}
 */
function isDuringStockPriceHours(m: any) {
  m = _verifyMoment(m);

  const marketOpen = config.isRealtimeStockPrice
    ? getStockMarketOpenTime(m)
    : getStockMarketOpenTime(m).add(15, 'minutes');
  const marketClose = getStockMarketCloseTime(m).add(1, 'hour');

  if (
    m.isBetween(marketOpen, marketClose) &&
    !isWeekend(m) &&
    !isStockMarketHoliday(m)
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Get the stock market open time
 * @param {moment} [m]
 * @returns {moment}
 */
function getStockMarketOpenTime(m: any) {
  m = _verifyMoment(m);

  return Moment(m).hour(9).minute(30).second(0).milliseconds(0);
}

/**
 * For a given time, return the time that the stock market last opened
 * @param {moment} [m]
 * @returns {moment}
 */
function getPreviousStockMarketOpenTime(m: any) {
  m = _verifyMoment(m);

  // If we're before market-open today, step back one day.
  if (m.isBefore(getStockMarketOpenTime(m))) {
    m.subtract(1, 'days');
  }

  // If it's not a holiday or a weekend, give back market-close time for
  // the current day. Otherwise, step back 1 day and try again.
  while (true) {
    if (!isStockMarketHoliday(m) && !isWeekend(m)) {
      return getStockMarketOpenTime(m);
    }
    m.subtract(1, 'days');
  }
}

/**
 * Get the stock market close time
 * @param {moment} [m]
 * @returns {moment}
 */
function getStockMarketCloseTime(m: any) {
  m = _verifyMoment(m);

  if (isStockMarketHalfDay(m)) {
    return Moment(m).hour(13).minute(0).second(0).milliseconds(0);
  } else {
    return Moment(m).hour(16).minute(0).second(0).milliseconds(0);
  }
}

/**
 * For a given time, return the time that the stock market last closed
 * @param {moment} [m]
 * @returns {moment}
 */
function getPreviousStockMarketCloseTime(m: any) {
  m = _verifyMoment(m);

  // If we're before market-close today, step back one day.
  if (m.isBefore(getStockMarketCloseTime(m))) {
    m.subtract(1, 'days');
  }

  // If it's not a holiday or a weekend, give back market-close time for
  // the current day. Otherwise, step back 1 day and try again.
  while (true) {
    if (!isStockMarketHoliday(m) && !isWeekend(m)) {
      return getStockMarketCloseTime(m);
    }
    m.subtract(1, 'days');
  }
}

/**
 * Check if a given moment is on a weekend
 * @param {moment} [m]
 * @returns {boolean}
 */
function isWeekend(m: any) {
  m = _verifyMoment(m);

  return m.day() === 0 || m.day() === 6;
}

/**
 * Check if a given moment is a stock market holiday
 * @param {moment} [m]
 * @returns {boolean}
 */
function isStockMarketHoliday(m: any) {
  m = _verifyMoment(m);

  if (
    // Standard Holidays
    m.isSame(Moment(m).month('December').date(25), 'day') || // Chistmas Day (every year)
    m.isSame(Moment(m).month('January').date(1), 'day') || // New Years Day (every year)
    m.isSame(Moment(m).month('July').date(4), 'day') || // Independence Day (every year)
    // 2021
    m.isSame('2021-01-18', 'day') || // MLK Day 2021
    m.isSame('2021-02-15', 'day') || // President's Day 2021
    m.isSame('2021-04-02', 'day') || // Good Friday 2021
    m.isSame('2021-05-31', 'day') || // Memorial Day 2021
    m.isSame('2021-07-05', 'day') || // July 4th Observed Day 2021
    m.isSame('2021-09-06', 'day') || // Labor Day 2021
    m.isSame('2021-11-25', 'day') || // Thanksgiving Day 2021
    m.isSame('2021-12-24', 'day') || // Christmas Day 2021 (Observed)
    // 2022
    m.isSame('2022-01-17', 'day') || // MLK Day 2022
    m.isSame('2022-02-21', 'day') || // President's Day 2022
    m.isSame('2022-04-15', 'day') || // Good Friday 2022
    m.isSame('2022-05-30', 'day') || // Memorial Day 2022
    m.isSame('2022-06-20', 'day') || // Juneteenth 2022
    m.isSame('2022-07-04', 'day') || // July 4th Observed Day 2022
    m.isSame('2022-09-05', 'day') || // Labor Day 2022
    m.isSame('2022-11-24', 'day') || // Thanksgiving Day 2022
    m.isSame('2022-12-26', 'day') || // Christmas Day 2021 (Observed)
    // 2023
    m.isSame('2023-01-02', 'day') || // New Years Day 2023 (Observed)
    m.isSame('2023-01-16', 'day') || // MLK Day 2023
    m.isSame('2023-02-20', 'day') || // President's Day 2023
    m.isSame('2023-04-07', 'day') || // Good Friday 2023
    m.isSame('2023-05-29', 'day') || // Memorial Day 2023
    m.isSame('2023-06-19', 'day') || // Juneteenth 2023
    m.isSame('2023-09-04', 'day') || // Labor Day 2023
    m.isSame('2023-11-23', 'day') || // Thanksgiving Day 2023
    // 2024
    m.isSame('2024-01-15', 'day') || // MLK Day 2024
    m.isSame('2024-02-19', 'day') || // President's Day 2024
    m.isSame('2024-03-29', 'day') || // Good Friday 2024
    m.isSame('2024-05-27', 'day') || // Memorial Day 2024
    m.isSame('2024-06-19', 'day') || // Juneteenth 2024
    m.isSame('2024-09-02', 'day') || // Labor Day 2024
    m.isSame('2024-11-28', 'day') // Thanksgiving Day 2024
  ) {
    return true;
  }
  return false;
}

/**
 * Check if a given moment is half day of stock trading
 * @param {moment} [m]
 * @returns {boolean}
 */
function isStockMarketHalfDay(m: any) {
  m = _verifyMoment(m);

  if (
    // 2021
    m.isSame('2021-11-26', 'day') || // Following Thanksgiving Day 2021
    // 2022
    m.isSame('2022-11-25', 'day') || // Following Thanksgiving Day 2022
    // 2023
    m.isSame('2023-07-03', 'day') || // Preceding July 4th 2023
    m.isSame('2023-11-24', 'day') || // Following Thanksgiving Day 2023
    // 2024
    m.isSame('2024-07-03', 'day') || // Preceding July 4th 2024
    m.isSame('2024-11-24', 'day') || // Following Thanksgiving Day 2024
    m.isSame('2024-12-24', 'day') // Preceding Christmas 2024
  ) {
    return true;
  }
  return false;
}

/**
 * Check if a given time is past a given delay threshold
 * @param {moment} m - the time to compare against in unix time
 * @param {int} delay - number of seconds of the delay threshold
 * @returns {boolean}
 */
function isPastDelayThreshold(m: any, delay: number) {
  return m.isBefore(Moment().subtract(delay, 'seconds'));
}

/**
 * Verify if the provided object is a moment
 * @param {moment} [m]
 * @returns {moment}
 */
function _verifyMoment(m: any) {
  return Moment.isMoment(m) ? m.clone() : Moment();
}

export default {
  getMongoTimestamp,
  getMongoDate,
  getDate,
  getUtcTimestamp,
  convertFromGmtMysqlTimestamp,
  convertFromMongoDate,
  getGameGuid,
  getWeeklyDrawGuid,
  getMonthlyDrawGuid,
  getWeeklyDrawPeriod,
  getWeeklyDrawStartTime,
  getWeeklyDrawEndTime,
  getMonthlyDrawPeriod,
  getMonthlyDrawStartTime,
  getMonthlyDrawEndTime,
  getWeeklyCryptoGamePeriod,
  getWeeklyCryptoGameStartTime,
  getWeeklyCryptoGameEndTime,
  getCryptoMarketOpenTime,
  getPreviousCryptoMarketOpenTime,
  getCryptoMarketCloseTime,
  getWeeklyStockGamePeriod,
  getWeeklyStockGameStartTime,
  getWeeklyStockGameEndTime,
  isWeeklyStockGameOver,
  isDuringStockMarketHours,
  isDuringStockPriceHours,
  getStockMarketOpenTime,
  getPreviousStockMarketOpenTime,
  getStockMarketCloseTime,
  getPreviousStockMarketCloseTime,
  isWeekend,
  isStockMarketHoliday,
  isStockMarketHalfDay,
  isPastDelayThreshold,
  _verifyMoment,
};
