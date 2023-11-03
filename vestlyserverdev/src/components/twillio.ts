import CONFIG from '../../config';
import twillio from 'twilio';

const accountSid = 'AC7c6f0a01c9aff0fcf455870c3c11fa3e';
const authToken = CONFIG.twillio.authToken;
const client = twillio(accountSid, authToken);

export default { client };
