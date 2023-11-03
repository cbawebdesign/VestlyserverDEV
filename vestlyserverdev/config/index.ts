import DEV_CONFIG from './development';
import PROD_CONFIG from './production';
import DEFAULT_CONFIG from './default';

const development = process.env.NODE_ENV !== 'production';
const envConfig = development ? DEV_CONFIG : PROD_CONFIG;
const defaultConfig = DEFAULT_CONFIG;

export default {
  ...envConfig,
  ...defaultConfig,
};
