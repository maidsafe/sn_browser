#!/bin/bash
clean=""
if [ $1 ]; then
  clean="--clean"
fi

DEST_FOLD="../app/node_modules/beaker-plugin-safe-authenticator"

cd authenticator

npm i && npm run build-libs -- --features="mock-routing" $clean && npm run build

mkdir -p $DEST_FOLD

FILES_ARR="./dist ./index.js ./_package.json"

for File in $FILES_ARR
do
	cp -fr $File $DEST_FOLD
done

mv $DEST_FOLD"/_package.json" $DEST_FOLD"/package.json"

rm -rf _package.json
