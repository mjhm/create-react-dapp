# Create React dApp
## An Ethereum dApp bootstrapper.

## Quick Start

### Install [Truffle](http://truffleframework.com/docs/getting_started/installation)
```
npm install -g truffle
```
### Create your app and start a Ganache blockchain.
```
npx create-react-dapp mydapp
cd mydapp
npm run ganache
```

### Compile and deploy contracts, then launch the app.

In a separate shell (from the same `./mydapp` folder)

```
npm run migrate
npm start
```

This should launch a browser at URL `http://localhost:3000`. If it doesn't, try navigating there directly.

# Contents

<!-- toc -->

- [Features](#features)
- [Build Your dApp](#build-your-dapp)
- [Deployment Options](#deployment-options)
  * [Ganache and Ganache UI](#ganache-and-ganache-ui)
  * [Rinkeby and Other Public TestNets](#rinkeby-and-other-public-testnets)
  * [Ethereum Main Network](#ethereum-main-network)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
  * [Installation](#installation)
  * [Migration](#migration)
- [Acknowledgements](#acknowledgements)

<!-- tocstop -->

## Features

1. Uses Facebook's [`create-react-app`](https://github.com/facebook/create-react-app) directly, so it will always retrieve the latest React and Webpack features and best practices, with no configuation.
2. Clear separation of concerns between the React and Ethereum programming.
3. Uses Truffle for compilation and migration management of Ganache, Rinkeby, and MainNet configurations.
4. Minimal and self-contained installation. Doesn't require Remix, Geth, or Parity.

## Build Your dApp

- All of the React code is in the `src` folder. Most of your work there will be in `src/components`
- All of the Ethereum code is in the `dapp` folder, most of your work will be in the Solidity code of `dapp/contracts`.
- When contracts are deployed (or migrated) the necessary contract connection info is copied into the `public/contract-info` folder.
- Use `src/helpers/fetchContracts.js` to retrieve this contract info, so that it can be connected to the appropriate handlers in your app. See `src/helpers/Voting.js` for example.

## Deployment Options

All of the out-of-the box deployment configurations are in the [truffle.js](./template/dapp/truffle.js) file.

All of the `npm run ...` scripts are in the [package.json](./template/package.json) file.

BTW feel free to use **yarn** instead of **npm** in any of the commands below (I do).

### Ganache and Ganache UI

The Quick Start section uses the `ganache-cli` testnet (formerly `testrpc`). This is the simplest and default configuration.

The [Ganache UI](http://truffleframework.com/ganache/) gives a more visual and interactive interaction to a Ganache testnet. After installing and launching the Ganache UI. Use

```
npm run migrate_ganacheUI
npm run start_ganacheUI
```

> 💡 Restarting the GanachUI is easy but not obvious. Click on the ⚙️ icon in the upper right of the UI. Then click the "Restart" button.

> 💡 Truffle migrations are designed to be roughly analogous to database migrations, in that they replace and/or extend the original contracts. Migrations need to be thought through carefully and are case specific. So for simplicity  `npm run migrate_ganacheUI` scripts heavy handedly uses `--reset` and `--compile-all`.

### Rinkeby and Other Public TestNets

For the public test nets you will need to install [MetaMask](https://metamask.io/) in your browser. Follow the installation instructions, create an account, then use the upper right menu to select the "Rinkeby Test Network".

> ⚠️ **Security precaution.** If you already have a real Ethereum account on the Main Ethereum Network, you should create a new dummy account for use with Rinkeby. This will prevent accidental exposure of your real account's PrivateKey. To do so use the MetaMask account selection icon (top of metamask, second icon from the right).

You will also need to get some test "ether" from the [Rinkeby Faucet](https://www.rinkeby.io/#faucet)

Next copy the account's Private Key from MetaMask. To do so click on the **▪️ ▪️ ▪️** icon to the right of the account's name, click "Export Private Key", follow the password prompt, then click on the private key to copy it to the clipboard.

Now we're ready to go. (Be patient with the migration. It can take a minute.)
```
ETH_PK=<paste private key here> npm run migrate_rinkeby
npm run start_rinkeby
```

Once a smart contract is deployed to a public network it lives there forever. However our sample contracts inherit from the standard `mortal` contract, which means they have a "kill" switch. To kill the contracts in Rinkeby use

```
ETH_PK=<paste private key here> npm run kill_rinkeby
```
> ⚠️ Redo'ing the "migrate" step overwrites the contract address in the compilation artifacts, so the "kill" script will not be able to find the contract to kill. So be sure to "kill" the contracts before re-migrating.

The other test nets (Kovan and Ropsten) should be similar, but you will need to add their configs to [truffle.js](./template/dapp/truffle.js) and optionally migrate and start scripts to [package.json](./template/package.json)

### Ethereum Main Network

Once everything is tested thoroughly on Rinkeby, you'll (obviously) want to deploy to the Ethereum Main Network. No scripts are included for working with the "live" network, because if you are to this point, you shouldn't need to use the scripts as training wheels.

> ⚠️ Deploying the contracts will cost you. At the time of this writing it's about $5, and each "vote" in the app costs about $0.10. However if you set your `gasPrice` too high it can cost you a lot more. So don't put your life savings into the account that you deploy from, and be careful how you set the `gas` and `gasPrice` parameters in [truffle.js](./template/dapp/truffle.js)

## Testing

A few sample tests are included on both sides of the app. The `npm` test commands are.

```
npm run test_components // runs the standard create-react-app Jest tests for the front end.
npm run test_contracts  // launches a silent ganache testnet then runs "truffle test"
npm test                // runs both
```

## Troubleshooting

### Installation

1. Upgrade to node version >=8 and npm version >=5.2.0. The `create-react-dapp` script depends on `npx` which is included in the later versions of `npm`.
2. Upgrade `create-react-app` to the latest version.  Or even better uninstall it. You probably don't need it anymore since `npx create-react-app ...` loads and uses the most recent version of `create-react-app` on the fly.

### Migration

If migration fails on GanacheUI just try rerunning. Example error:
```
Error encountered, bailing. Network state unknown. Review successful transactions manually.
Error: The contract code couldn't be stored, please check your gas amount.
...
```

### Any Other Problems

Please file an issue: https://github.com/mjhm/create-react-dapp/issues

## Acknowledgements

- The starting place for the Voting app in this project came from [Mahesh Murthy's Medium article](https://medium.com/@mvmurthy/full-stack-hello-world-voting-ethereum-dapp-tutorial-part-1-40d2d0d807c2) which provides a very easy to follow introduction to writing Ethereum dApps.
- The Create React App developers have done an awesome job building the very best starting tool for web app development. The standards they've set are an inspiration.
- The Truffle Framework team is pioneering the infrustructure needed for building Ethereum dApps. This framework is not just providing tools, but also establishing best practices for dApp development.


