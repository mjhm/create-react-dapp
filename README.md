# Create React dApp -- An Ethereum App Bootstrapper

## Quick Start

### [Install Truffle](http://truffleframework.com/docs/getting_started/installation)
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

In a separate shell

```
npm run migrate
npm start
```

<!-- toc -->

- [Features](#features)
- [Depolyment Options](#depolyment-options)
  * [Ganache and Ganache UI](#ganache-and-ganache-ui)
  * [Rinkeby and Other TestNets](#rinkeby-and-other-testnets)
  * [Ethereum MainNet](#ethereum-mainnet)

<!-- tocstop -->

## Features

1. Uses Facebook's `create-react-app` directly, so it will always retrieve the latest React and Webpack features and best practices, with no configuation.
2. Clear separation of concerns between the React and Ethereum programming.
3. Uses Truffle for compilation and migration management for Ganache, Rinkeby, and MainNet configurations.
4 Doesn't require Remix, Geth, or Parity.

## Depolyment Options

### Ganache and Ganache UI

### Rinkeby and Other TestNets

### Ethereum MainNet




