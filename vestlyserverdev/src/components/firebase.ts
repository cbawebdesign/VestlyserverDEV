/**
 * Firebase Component
 * components/firebase.js
 *
 * Firebase Interface
 *
 */

import firebaseAdmin from 'firebase-admin';
import CONFIG from '../../config';

const options = {
  credential: firebaseAdmin.credential.cert(CONFIG.firebase.credential),
};

firebaseAdmin.initializeApp(options);

export default {
  auth: firebaseAdmin.auth,
};
