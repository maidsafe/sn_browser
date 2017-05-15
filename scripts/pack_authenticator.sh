#!/bin/bash
clean=""
if [ $1 ]; then
  clean="--clean"
fi
git submodule update --init --recursive

DEST_FOLD="../app/node_modules/beaker-plugin-safe-authenticator"

cd authenticator

npm i && npm run build-libs -- --features="mock-routing" $clean && npm run build

mkdir -p $DEST_FOLD

FILES_ARR="./dist ./index.js ./package.json"

for File in $FILES_ARR
do
	cp -fr $File $DEST_FOLD
done
