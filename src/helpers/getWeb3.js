/* global web3 */

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
      return callback(
        new Error(
          `The web app's netId (${requestedNetId}) doesn't match Web3's netId (${actualNetId}), perhaps MetaMask is set to the wrong network`,
        ),
      );
    }
    return callback(null);
  });
};

const resolver = (resolve, reject, networkLocation) => {
  const localWeb3 =
    typeof web3 === 'undefined'
      ? new Web3(
          new Web3.providers.HttpProvider(
            `http://${networkLocation.host}:${networkLocation.port}`,
          ),
        )
      : new Web3(web3.currentProvider);

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
