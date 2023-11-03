import express from 'express';
import AuthController from '../controllers/Auth';
import GameController from '../controllers/Games';
import StocksController from '../controllers/Stocks';
import PortfolioController from '../controllers/Portfolio';
import authMiddleware from '../middleware/auth';

const app = express();

// 'Authenticate a user with Firebase',
app.post('/auth', authMiddleware.tokenCheck, AuthController.authUser);

app.get('/get-game/:gameId', authMiddleware.tokenCheck, GameController.getGame);
app.post('/create-game', authMiddleware.tokenCheck, GameController.createGame);

app.get(
  '/get-last-trading-date/:type',
  authMiddleware.tokenCheck,
  StocksController.getLastTradingDate
);
app.post(
  '/get-purchase-quote',
  authMiddleware.tokenCheck,
  StocksController.getPurchaseQuote
);
app.post(
  '/open-position',
  authMiddleware.tokenCheck,
  PortfolioController.openPosition
);

export default app;
