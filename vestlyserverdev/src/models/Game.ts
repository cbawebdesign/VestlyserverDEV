import mongoose, { Types } from 'mongoose';
import config from '../../config';
import { GamePlayer, GameType } from '../types';

const Schema = mongoose.Schema;

export interface IGame {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  guid: string;
  length: string;
  startAt: Date;
  endAt: Date;
  isEnabled: true;
  players: GamePlayer[];
  name: string;
  type: GameType;
}

const gameSchema = new Schema<IGame>(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    guid: { type: String, required: true },
    length: { type: String, required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    isEnabled: { type: Boolean, required: true },
    name: { type: String, required: true },
    players: [
      {
        userId: { type: mongoose.Types.ObjectId },
        username: { type: String },
        avatar: { type: String },
        phoneNumber: { type: String, required: true },
        portfolio: { type: Types.ObjectId, ref: 'Portfolio' },
        balance: {
          type: Number,
          required: true,
          default: config.startValue,
        },
      },
    ],
    type: { type: String, required: true },
  },
  { collection: 'games' }
);

const ModelClass = mongoose.model('Game', gameSchema, 'games');

export default ModelClass;
