import express, { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import { GamePlayer, IGetCustomAuthInfoRequest } from '../types';
import Game, { IGame } from '../models/Game';
import User from '../models/User';
import Util from '../components/utils';
import TimeService from '../services/time.service';
import Moment from '../components/moment';
import twillio from '../components/twillio';
import CONFIG from '../../config';
import XigniteService from '../services/xignite.service';

async function getLastTradingDate(
  req: IGetCustomAuthInfoRequest,
  res: Response,
  next: NextFunction
) {
  const { params } = req;

  let previousStockMarketOpenTime: any;
  let precision = '';
  let units = '';
  let startDate = '';

  const moment = Moment(Date.now());
  const isDuringStockMarketHours = TimeService.isDuringStockMarketHours(moment);

  if (isDuringStockMarketHours) {
    previousStockMarketOpenTime = TimeService.getStockMarketOpenTime(moment);
  } else {
    previousStockMarketOpenTime =
      TimeService.getPreviousStockMarketOpenTime(moment);
  }

  if (params.type === '1D') {
    precision = 'Minutes';
    units = '20'; // 1 stock price or every 20 minutes

    startDate = previousStockMarketOpenTime.format('YYYY-MM-DD HH:mm:ss');
  } else if (params.type === '5D') {
    precision = 'Hours';
    units = '2'; // 1 stock price or 5 hours

    const lastTradingDateObject = new Date(
      previousStockMarketOpenTime.toDate()
    );
    const startDateObject = lastTradingDateObject.setDate(
      lastTradingDateObject.getDate() - 7
    );

    startDate = new Date(startDateObject).toLocaleString('en-US');
  }

  return res.status(200).send({
    data: {
      startDate,
      precision,
      units,
    },
  });
}

async function getPurchaseQuote(
  req: IGetCustomAuthInfoRequest,
  res: Response,
  next: NextFunction
) {
  const { data } = req.body;

  try {
    const result = await XigniteService.getSuperQuote(data);

    return res.status(200).send({
      data: {
        quote: result,
      },
    });
  } catch (error) {
    next(error);
  }
}

export default { getLastTradingDate, getPurchaseQuote };
