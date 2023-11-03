import mongoose, { Types } from 'mongoose';
import { IPortfolio } from './Portfolio';

const Schema = mongoose.Schema;

export interface IPosition {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  portfolioId: IPortfolio;
  assetId: string;
  openPrice: number;
  openedAt: Date;
  quantity: number;
  openFilledAt?: Date;
  closePrice?: number;
  closedAt?: Date;
  closeFilledAt?: Date;
  metadata?: string;
}

const positionSchema = new Schema<IPosition>(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    portfolioId: { type: Types.ObjectId, ref: 'Portfolio', required: true },
    assetId: { type: String, required: true },
    openPrice: { type: Number, required: true },
    openedAt: { type: Date, required: true },
    quantity: { type: Number, required: true },
    openFilledAt: { type: Date },
    closePrice: { type: Number },
    closedAt: { type: Date },
    closeFilledAt: { type: Date },
    metadata: { type: String },
  },
  { collection: 'positions' }
);

const ModelClass = mongoose.model('Position', positionSchema, 'positions');

export default ModelClass;
