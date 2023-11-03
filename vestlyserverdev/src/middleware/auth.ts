// import Token, { IToken } from '../models/Token';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';
// import { IGetCustomAuthInfoRequest } from '../types';
// import * as authHelper from '../helpers/authentication';
import Firebase from '../components/firebase';
import { IGetCustomAuthInfoRequest } from '../types';

const tokenCheck = async (
  req: IGetCustomAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const firebaseToken = req.header('Authorization')?.replace('Bearer ', '');

  try {
    if (!firebaseToken) {
      // Sign out from app
      return res.status(401).send({
        type: 401,
        message: 'Please renew your login.',
      });
    }

    const decodedToken = await Firebase.auth().verifyIdToken(firebaseToken);

    if (!decodedToken) {
      // Sign out from app
      return res.status(401).send({
        type: 401,
        message: 'Please renew your login.',
      });
    }

    req.decodedToken = decodedToken;

    // Get Firebase user id
    const firebaseUserId = decodedToken.uid;

    // Find user and set user on request object
    const userData = await User.findOne({
      guid: firebaseUserId,
    });
    req.user = userData;

    next();
  } catch (error) {
    next(error);
  }
};

export default { tokenCheck };
