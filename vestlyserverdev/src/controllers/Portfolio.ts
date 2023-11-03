import { NextFunction, Request, Response } from 'express';
import { IGetCustomAuthInfoRequest, Quote } from '../types';
import Portfolio from '../models/Portfolio';
import Position from '../models/Position';
import Game from '../models/Game';
import PositionPrice from '../models/PositionPrice';
import TimeService from '../services/time.service';
import XigniteService from '../services/xignite.service';

import config from '../../config';

async function openPosition(
  req: IGetCustomAuthInfoRequest,
  res: Response,
  next: NextFunction
) {
  const {
    data,
  }: { data: { identifier: string; gameId: string; positionSize: string } } =
    req.body;

  if (!req.user) {
    throw new Error('An error occured retrieving the user from the request.');
  }

  const _maxPortfolioAssets = config.maxPortfolioAssets;
  const tradeTime = TimeService.getMongoTimestamp();

  try {
    // Check to see if the portfolio exists and create new one if none is found.
    let userPortfolio = await Portfolio.findOne({
      gameId: data.gameId,
      userId: req.user._id,
    });

    if (!userPortfolio) {
      const newPortfolio = new Portfolio({
        userId: req.user._id,
        gameId: data.gameId,
      });

      // Update game.players with new portfolio
      await Game.findOneAndUpdate(
        { _id: data.gameId, 'players.userId': req.user._id },
        {
          $set: {
            'players.$.portfolio': newPortfolio._id,
          },
        }
      );

      await newPortfolio.save();

      userPortfolio = newPortfolio;
    }

    // Limit the amount of positions a user can own at once
    const numOpenPositions = userPortfolio.positions.length;

    // If the user is over the limit send an error
    if (numOpenPositions >= _maxPortfolioAssets) {
      return res.status(402).send({
        messages: [
          {
            id: 'positionLimitReached',
            type: 'alert',
            title: 'Limit Reached!',
            message:
              "You have reached the current limit of positions in your portfolio. You'll have to close some positions before you can open more.",
            buttons: [
              {
                label: 'Ok',
                ack: true,
                action: 'dismiss',
                analytics: 'button:positionLimitReached:ok',
              },
            ],
          },
        ],
      });
    }

    // Find the asset
    const quote: Quote = await XigniteService.getSuperQuote(data.identifier);

    // Check if quote is for extended hours
    // if (
    //   //   process.env.NODE_ENV === 'production' &&
    //   typeof quote.extendedHoursType === 'string'
    // ) {
    //   return res.status(402).send({
    //     messages: [
    //       {
    //         id: 'extendedHours',
    //         type: 'alert',
    //         title: 'Extended Hours!',
    //         message:
    //           'The stock market has entered Extended Hours. Trading is possible only during regular trading hours.',
    //         buttons: [
    //           {
    //             label: 'Ok',
    //             ack: true,
    //             action: 'dismiss',
    //             analytics: 'button:extendedHours:ok',
    //           },
    //         ],
    //       },
    //     ],
    //   });
    // }

    // If the asset is a stock check if trading is halted
    if (quote.tradingHalted) {
      // Reply here directly so we don't go any further
      return res.status(402).send({
        messages: [
          {
            id: 'tradingHalted',
            type: 'alert',
            title: 'Trading Halt!',
            message:
              'The exchange has halted trading for this asset, please try again soon.',
            buttons: [
              {
                label: 'Ok',
                ack: true,
                action: 'dismiss',
                analytics: 'button:tradingHalted:ok',
              },
            ],
          },
        ],
      });
    }

    // Create the new position and price records
    // Old API uses AWS Queue service + Price.Worker to create PositionPrice records.
    // Vestly Stage 1 only allows for trading during trading hours, so we keep it simple and might upgrade later.
    const newPosition = new Position({
      portfolioId: userPortfolio._id,
      assetId: quote.identifier,
      openPrice: quote.ask,
      openedAt: tradeTime,
      quantity: data.positionSize,
    });

    const newPositionPrice = new PositionPrice({
      ...quote,
      positionId: newPosition._id,
      tradedAt: quote.dateTime,
    });
    await newPositionPrice.save();
    await newPosition.save();

    // Add new position to portfolio
    await Portfolio.findByIdAndUpdate(
      {
        _id: userPortfolio._id,
      },
      {
        $push: { positions: newPosition },
      },
      { new: true }
    );

    // Update game balance for GamePlayer
    const updatedGame = await Game.findOneAndUpdate(
      { _id: data.gameId, 'players.userId': req.user._id },
      {
        $inc: {
          'players.$.balance': Number(data.positionSize) * quote.ask * -1,
        },
      },
      { new: true }
    ).populate({
      path: 'players',
      populate: {
        path: 'portfolio',
        select: 'positions isTradingHalted',
        populate: {
          path: 'positions',
          select: 'assetId openPrice quantity',
        },
      },
    });

    return res.status(200).send({
      data: {
        game: updatedGame,
      },
    });
  } catch (error) {
    console.log('error', error);
    next(error);
  }
}

export default { openPosition };
