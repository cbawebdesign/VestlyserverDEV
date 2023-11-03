import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import { GamePlayer, GameType, IGetCustomAuthInfoRequest } from '../types';
import Game from '../models/Game';
import User from '../models/User';
import TimeService from '../services/time.service';
import Moment from '../components/moment';
import twillio from '../components/twillio';
import config from '../../config';
import Portfolio from '../models/Portfolio';

async function createGame(
  req: IGetCustomAuthInfoRequest,
  res: Response,
  next: NextFunction
) {
  const { data } = req.body;

  if (!req.user) {
    throw new Error('An error occured getting the user off the request.');
  }

  try {
    let validationErrors: { errors: string[]; phoneNumber: string } | undefined;

    // Check phone number validity
    for (const player of data.players) {
      const twilioResult = await twillio.client.lookups.v2
        .phoneNumbers(player.phoneNumber)
        .fetch({ countryCode: 'US' });

      if (!twilioResult.valid) {
        validationErrors = {
          errors: twilioResult.validationErrors,
          phoneNumber: player.phoneNumber,
        };
      }
    }

    if (validationErrors) {
      return res.status(200).send({
        message: validationErrors.errors.join(', '),
        data: validationErrors.phoneNumber,
      });
    }

    // Options: 1 week, 1 month, 3 months;
    if (data.duration === 'months') {
      Moment(data.startTime).add(3, 'month');
    } else {
      Moment(data.startTime).add(1, data.duration);
    }

    // Get weekly stock game times
    const weeklyStockGamePeriod = TimeService.getWeeklyStockGamePeriod(
      undefined,
      true
    );
    const weeklyStockGameGuid = TimeService.getGameGuid(
      weeklyStockGamePeriod,
      'stock',
      data.duration
    );
    const weeklyStockGamePeriodMoment = TimeService.getWeeklyStockGamePeriod(
      undefined,
      false,
      true
    );
    const weekStockGameStartTime = TimeService.getMongoTimestamp(
      TimeService.getWeeklyStockGameStartTime()
    );
    const weekStockGameEndTime = TimeService.getMongoTimestamp(
      TimeService.getWeeklyStockGameEndTime()
    );

    // Create weekly stock game

    const phoneNumbers = data.players
      .map((item: GamePlayer) => item.phoneNumber)
      .concat(req.user.phoneNumber);

    const users = await User.find({ phoneNumber: phoneNumbers });

    const players = phoneNumbers.map((item: string, index: number) => {
      const user = users.find((element) => element.phoneNumber === item);

      if (user) {
        return {
          userId: user._id,
          username: user.username,
          phoneNumber: user.phoneNumber,
        };
      }

      return {
        phoneNumber: item,
      };
    });

    // Init new game
    const newGame = new Game({
      guid: weeklyStockGameGuid,
      name: `Weekly Stock Contest - ${weeklyStockGamePeriodMoment.format(
        'MMMM Do, YYYY'
      )}`,
      length: data.duration,
      startAt: weekStockGameStartTime,
      endAt: weekStockGameEndTime,
      isEnabled: true,
      players,
      type: GameType.PRIVATE,
    });

    // Invite players
    let phoneNumbersToInvite;
    if (process.env.NODE_ENV === 'development') {
      phoneNumbersToInvite = [config.phoneNumberForTesting];
    } else {
      phoneNumbersToInvite = players
        .filter((item: GamePlayer) => !item.username)
        .map((item: GamePlayer) => item.phoneNumber);
    }

    // Init portfolios and send invites
    for (const number of phoneNumbersToInvite) {
      if (process.env.NODE_ENV === 'production') {
        await twillio.client.messages
          .create({
            messagingServiceSid: config.twillio.sid,
            to: number,
            body: `You have been invited to a new game at Vestly. Follow the link below to enter:\n
          https://vestly.app/game/${newGame._id}`,
          })
          .then((result) => console.log('result', result))
          .catch((error) => console.log('twillio error', error));
      }
    }

    await newGame.save();

    return res.status(200).send({
      data: {
        game: newGame,
      },
    });
  } catch (error) {
    console.log('createGame error', error);
    next(error);
  }
}

async function getGame(
  req: IGetCustomAuthInfoRequest,
  res: Response,
  next: NextFunction
) {
  const { params } = req;

  try {
    const game = await Game.findById(params.gameId).populate({
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

    if (!game) {
      throw new Error('Could not find a game for supplied gameId');
    }

    return res.status(200).send({
      data: {
        game,
      },
    });
  } catch (error) {
    console.log('createGame error', error);
    next(error);
  }
}

export default { createGame, getGame };
