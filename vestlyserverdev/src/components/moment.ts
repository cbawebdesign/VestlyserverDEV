/**
 * Moment Component
 * components/moment.js
 *
 * Moment.js Wrapper
 *
 */

import config from '../../config/development';
import Moment from 'moment-timezone';

Moment.tz.setDefault(config.timezone);

export default Moment;
