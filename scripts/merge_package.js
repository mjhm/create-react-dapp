#!/usr/bin/env node

console.log('process.argv', process.argv);

const fs = require('fs');
const reactPackageFile = `${process.argv[3]}/package.json`;
const dappPackage = require(`${process.argv[2]}/package.json`);
const reactPackage = require(reactPackageFile);

Object.assign(dappPackage.dependencies, reactPackage.dependencies);
fs.writeFileSync(reactPackageFile, JSON.stringify(dappPackage, null, 2));
