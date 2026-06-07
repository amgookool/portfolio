import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';


const firebaseConfig = {
  apiKey: 'AIzaSyB3H1sFXZuEoCqjdh3bEMXiYkJAxFmAI74',
  authDomain: 'amgookool-portfolio.firebaseapp.com',
  projectId: 'amgookool-portfolio',
  storageBucket: 'amgookool-portfolio.firebasestorage.app',
  messagingSenderId: '406641606493',
  appId: '1:406641606493:web:f7fa8538973eca795072b4',
  measurementId: 'G-XTQYR5RLNR',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app, analytics};