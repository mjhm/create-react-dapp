/* global web3 */
// @flow

import Web3 from 'web3';
declare var web3;

// const resolver = () =>
//   typeof web3 === 'undefined'
//     ? new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
//     : new Web3(web3.currentProvider);

const resolver = (location: { host: string, port: string }) =>
  new Web3(
    new Web3.providers.HttpProvider(`http://${location.host}:${location.port}`),
  );

const getWeb3 = (location: { host: string, port: string }) => {
  return new Promise(resolve => {
    if (document.readyState === 'complete') {
      resolve(resolver(location));
    } else {
      window.addEventListener('load', () => {
        resolve(resolver(location));
      });
    }
  });
};

export default getWeb3;
