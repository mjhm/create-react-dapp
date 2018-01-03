/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import EthInterface from './helpers/eth_interface';

ReactDOM.render(
  <App eth={new EthInterface()} />,
  document.getElementById('root'),
);
registerServiceWorker();
