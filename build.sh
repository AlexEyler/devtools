#!/bin/bash

pushd www
rustup default stable
npm install
npm run build
popd
