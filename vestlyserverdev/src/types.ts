import { Request } from 'express';
import { IUser } from './models/User';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { IPortfolio } from './models/Portfolio';

export enum GameType {
  PUBLIC = 'Public',
  PRIVATE = 'Private',
}

export interface IGetCustomAuthInfoRequest extends Request {
  user?: IUser | null;
  decodedToken?: DecodedIdToken | null;
}

export interface GamePlayer {
  userId?: string;
  username?: string;
  portfolio: IPortfolio;
  balance: number;
  phoneNumber: string;
}

export type Quote = {
  sourceApi: string;
  instrumentType: string;
  name: string;
  identifier: string;
  identifierType: string;
  market: string;
  marketIdentificationCode: string;
  dateTime: string;
  utcOffset: number;
  currency: string;
  open: number;
  high: number;
  low: number;
  last: number;
  lastSize: number;
  volume: number;
  volumeDate: string;
  previousClose: number;
  previousCloseDate: string;
  change: number;
  percentChange: number;
  extendedHoursType: string;
  extendedHoursDateTime: string;
  extendedHoursPrice: number;
  extendedHoursChange: number;
  extendedHoursPercentChange: number;
  bid: number;
  bidSize: number;
  bidDateTime: string;
  ask: number;
  askSize: number;
  askDateTime: string;
  tradingHalted: boolean;
  outcome: string;
  message: string;
  identity: string;
  delay: number;
};
