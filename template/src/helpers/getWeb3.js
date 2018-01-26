/* global web3 */

// NOTE: All this will be much cleaner with web3 1.x and async/await patterns.

import Web3 from 'web3';

const checkAccounts = (localWeb3, callback) => {
  localWeb3.eth.getAccounts((err, accounts) => {
    if (err) {
      return callback(err);
    }
    if (accounts.length === 0) {
      return callback(new Error('No accounts, perhaps MetaMask is locked'));
    }
    return callback(null, accounts[0]);
  });
};

const checkNetworkId = (localWeb3, requestedNetId, callback) => {
  localWeb3.version.getNetwork((err, actualNetId) => {
    if (err) {
      return callback(err);
    }
    if (requestedNetId.toString() !== actualNetId.toString()) {
      let hint = 'Perhaps MetaMask is set to the wrong network.';
      if (+requestedNetId > 10000 && +requestedNetId > 10000) {
        hint = 'Perhaps you need to redeploy your contracts.';
      }
      return callback(
        new Error(
          `The web app's netId (${requestedNetId}) doesn't match Web3's netId (${actualNetId}). ${hint}`,
        ),
      );
    }
    return callback(null);
  });
};

const resolver = (resolve, reject, networkLocation) => {
  let localWeb3;

  // Use HttpProvider if the requested networkLocation has host and port
  if (networkLocation.host && networkLocation.port) {
    localWeb3 = new Web3(
      new Web3.providers.HttpProvider(
        `http://${networkLocation.host}:${networkLocation.port}`,
      ),
    );
  } else if (typeof web3 === 'undefined') {
    return reject(
      new Error(
        "web3 isn't defined, perhaps MetaMask is disabled or not installed",
      ),
    );
  } else {
    localWeb3 = new Web3(web3.currentProvider);
  }

  // Check account and the network id, to prevent potentially costly surprises.
  checkAccounts(localWeb3, (err, defaultAccount) => {
    if (err) {
      return reject(err);
    }
    localWeb3.eth.defaultAccount = defaultAccount;
    return checkNetworkId(localWeb3, networkLocation.network_id, err => {
      if (err) {
        return reject(err);
      }
      resolve(localWeb3);
    });
  });
};

const getWeb3 = networkLocation => {
  // The resolver needs to be called after the DOM is ready to give MetaMask enough
  // time to inject "web3".
  return new Promise((resolve, reject) => {
    if (document.readyState === 'complete') {
      resolver(resolve, reject, networkLocation);
    } else {
      window.addEventListener('load', () => {
        resolver(resolve, reject, networkLocation);
      });
    }
  });
};

export default getWeb3;
