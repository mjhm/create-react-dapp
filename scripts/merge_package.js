#!/usr/bin/env node

const fs = require('fs');
const reactPackageFile = `${__dirname}/${process.argv[3]}/package.json`;
const dappPackage = require(`${__dirname}/${process.argv[2]}/package.json`);
const reactPackage = require(reactPackageFile);

Object.assign(dappPackage.dependencies, reactPackage.dependencies);
fs.writeFileSync(reactPackageFile, JSON.stringify(dappPackage, null, 2));
