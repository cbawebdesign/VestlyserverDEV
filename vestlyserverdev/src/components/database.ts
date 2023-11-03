/**
 * MongoDB Connect
 */

import mongoose from 'mongoose';
import CONFIG from '../../config';

const init = () => {
  mongoose
    .connect(CONFIG?.mongoDBConnectionString)
    .then(() => console.log('Database Connected'))
    .catch((err) => console.log('mongoose error', err));
};

export default {
  init,
};
