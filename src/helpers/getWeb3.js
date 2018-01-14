/* global web3 */
// @flow

import Web3 from 'web3';
declare var web3;

const getWeb3 = () => {
  return new Promise(resolve => {
    if (document.readyState === 'complete') {
      resolve(
        typeof web3 === 'undefined'
          ? new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
          : new Web3(web3.currentProvider),
      );
    } else {
      window.addEventListener('load', () => {
        resolve(
          typeof web3 === 'undefined'
            ? new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
            : new Web3(web3.currentProvider),
        );
      });
    }
  });
};

export default getWeb3;
