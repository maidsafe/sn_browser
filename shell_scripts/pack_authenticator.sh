#!/bin/bash

git submodule update --init --recursive

DEST_FOLD="../app/node_modules/beaker-plugin-safe-authenticator-1"

cd safe_authenticator

git submodule update --init --recursive

npm i && npm run build-native && npm run build 

mkdir -p $DEST_FOLD

FILES_ARR="./dist ./index.js ./package.json"

for File in $FILES_ARR
do
	cp -fr $File $DEST_FOLD
done

echo "Packed Authenticator!"
