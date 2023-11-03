import { NextFunction, Response } from 'express';
import _ from 'lodash';
import { GamePlayer, GameType, IGetCustomAuthInfoRequest } from '../types';
import User, { IUser } from '../models/User';
import Game from '../models/Game';
import Util from '../components/utils';

async function authUser(
  req: IGetCustomAuthInfoRequest,
  res: Response,
  next: NextFunction
) {
  const vestlyVersion = req.headers['x-vestly-version'];
  const appVersion = req.headers['x-app-version'];
  const deviceBrand = req.headers['x-device-brand'];
  const deviceId = req.headers['x-device-id'];

  const clientDeviceInfo = Util.getClientDeviceInfo(
    null,
    vestlyVersion,
    appVersion,
    deviceBrand,
    deviceId
  );

  try {
    if (!req.decodedToken) {
      throw new Error(
        'An error occured retrieving the decodedToken from the request.'
      );
    }

    // Get the sign in provider
    const signInProvider = req.decodedToken.firebase.sign_in_provider;

    // Check if the user is anonymous
    const userIsAnonymous = signInProvider === 'anonymous';

    // If the user is not anonymous get their phone number
    const userPhoneNumber = req.decodedToken.phone_number || null;

    // If the user has a phone number determine their country
    // const userCountry = userPhoneNumber ? phone(userPhoneNumber).countryIso3 : null;

    // If the user exists return
    if (req.user) {
      if (req.user.isDisabled) {
        return res.status(401).send({
          type: 401,
          message: 'Your account has been disabled.',
        });
      }

      if (req.user.deletedAt) {
        return res.status(401).send({
          type: 401,
          message: 'Your account has been deleted.',
        });
      }

      // Determine if the user is a new registration
      const userIsNoLongerAnonymous = req.user.isAnonymous !== userIsAnonymous;

      // Update user properties
      await User.findOneAndUpdate(
        { guid: req.decodedToken.uid },
        {
          phone: userPhoneNumber,
          // country: userCountry,
          isAnonymous: userIsAnonymous,
          appVersion: clientDeviceInfo.appVersion,
          deviceBrand: clientDeviceInfo.deviceBrand,
          deviceId: clientDeviceInfo.deviceId,
        },
        { new: true }
      );

      // Set updated records onto user data
      req.user.isAnonymous = userIsAnonymous;

      // Get games for user
      const games = await Game.find({
        'players.userId': req.user._id,
        type: GameType.PRIVATE,
      });

      // Get enabled Public Game Balance
      let privateGameBalance;
      const publicGame = await Game.findOne({
        isEnabled: true,
        type: GameType.PUBLIC,
      });
      const player: GamePlayer | undefined = publicGame?.players.find(
        (item) =>
          item.userId?.toString() === (req.user as IUser)._id?.toString()
      );
      const publicGameBalance = player ? player.balance : 1000;
      if (games.length > 0) {
        const player = games[0].players.find(
          (item) =>
            item.userId?.toString() === (req.user as IUser)._id?.toString()
        );
        privateGameBalance = player?.balance;
      } else {
        privateGameBalance = 1000;
      }

      // Return user data
      return res.status(200).send({
        data: {
          isNewUser: false,
          isNewRegistration: userIsNoLongerAnonymous,
          user: req.user,
          games,
          gameBalance: {
            publicGame: publicGameBalance,
            privateGame: privateGameBalance,
          },
        },
      });
    }

    // Create the new user
    const newUser = new User({
      guid: req.decodedToken.uid,
      username: `VP_${_.random(9999999999)}`,
      phone: userPhoneNumber,
      // country: userCountry,
      isAnonymous: userIsAnonymous,
      appVersion: clientDeviceInfo.appVersion,
      deviceBrand: clientDeviceInfo.deviceBrand,
      deviceId: clientDeviceInfo.deviceId,
    });
    await newUser.save();

    // Get back new user data
    const newUserData = await User.findOne({
      guid: req.decodedToken.uid,
    });

    const publicGameBalance = 1000;
    const privateGameBalance = 1000;

    return res.status(200).send({
      data: {
        isNewUser: true,
        isNewRegistration: !userIsAnonymous,
        user: newUserData,
        games: [],
        gameBalance: {
          publicGame: publicGameBalance,
          privateGame: privateGameBalance,
        },
      },
    });
  } catch (error) {
    console.log('auth error', error);
    next(error);
  }
}

export default { authUser };
