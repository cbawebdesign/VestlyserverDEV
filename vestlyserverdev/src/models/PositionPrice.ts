import mongoose, { Types } from 'mongoose';
import { IPosition } from './Position';

const Schema = mongoose.Schema;

export interface IPositionPrice {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  positionId: IPosition;
  identifier: string;
  tradedAt: Date;
  bid: number;
  bidDateTime: Date;
  ask: number;
  askDateTime: Date;
  last: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  previousCloseDate: Date;
  change: number;
  percentChange: number;
  tradingHalted: boolean;
}

// sourceApi: 'XigniteBATSRealTime_v3',
//   instrumentType: 'Stock',
//   name: 'Microsoft Corporation',
//   identifier: 'MSFT',
//   identifierType: 'Symbol',
//   market: 'NASDAQ',
//   marketIdentificationCode: 'XNAS',
//   dateTime: '2023-10-31 16:00:00',
//   utcOffset: -4,
//   currency: 'USD',
//   open: 338.85,
//   high: 339,
//   low: 334.69,
//   last: 338.11,
//   lastSize: 2910604,
//   volume: 21836,
//   volumeDate: '2023-11-01',
//   previousClose: 337.31,
//   previousCloseDate: '2023-10-30',
//   change: 0.8,
//   percentChange: 0.237,
//   extendedHoursType: 'PreMarket',
//   extendedHoursDateTime: '2023-11-01 07:41:04',
//   extendedHoursPrice: 336.82,
//   extendedHoursChange: -1.29,
//   extendedHoursPercentChange: -0.382,
//   bid: 337,
//   bidSize: 100,
//   bidDateTime: '2023-11-01 07:35:17',
//   ask: 337.25,
//   askSize: 100,
//   askDateTime: '2023-11-01 07:35:17',
//   tradingHalted: false,
//   outcome: 'Success',
//   message: null,
//   identity: 'Request',
//   delay: 0.0285528

const positionPriceSchema = new Schema<IPositionPrice>(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    positionId: { type: mongoose.Types.ObjectId, ref: 'Position' },
    identifier: { type: String, required: true },
    tradedAt: { type: Date, required: true },
    bid: { type: Number, required: true },
    bidDateTime: { type: Date, required: true },
    ask: { type: Number, required: true },
    askDateTime: { type: Date, required: true },
    last: { type: Number, required: true },
    open: { type: Number, required: true },
    high: { type: Number, required: true },
    low: { type: Number, required: true },
    previousClose: { type: Number, required: true },
    previousCloseDate: { type: Date, required: true },
    change: { type: Number, required: true },
    percentChange: { type: Number, required: true },
    tradingHalted: { type: Boolean, required: true },
  },
  { collection: 'positionPrices' }
);

const ModelClass = mongoose.model(
  'PositionPrice',
  positionPriceSchema,
  'positionPrices'
);

export default ModelClass;
