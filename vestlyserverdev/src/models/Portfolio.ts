import mongoose, { Types } from 'mongoose';
import { IUser } from './User';
import { IGame } from './Game';
import { IPosition } from './Position';

const Schema = mongoose.Schema;

export interface IPortfolio {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  userId?: IUser;
  gameId: IGame;
  isTradingHalted: boolean;
  positions: IPosition[];
}

const portfolioSchema = new Schema<IPortfolio>(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    userId: { type: Types.ObjectId, ref: 'User' },
    gameId: { type: Types.ObjectId, ref: 'Game', required: true },
    isTradingHalted: { type: Boolean, default: false },
    positions: [{ type: Types.ObjectId, ref: 'Position' }],
  },
  { collection: 'portfolios' }
);

const ModelClass = mongoose.model('Portfolio', portfolioSchema, 'portfolios');

export default ModelClass;
