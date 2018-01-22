/* eslint-env browser */
/* global process */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './RegisterServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';

const env = {
  network: process.env.REACT_APP_ETH_NETWORK || 5777,
};
ReactDOM.render(<App {...env} />, document.getElementById('root'));
registerServiceWorker();
