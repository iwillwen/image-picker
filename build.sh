#!/bin/bash
basedir=$(cd "$(dirname "$0")";pwd);
mkdir zip && rsync -a --exclude node_modules/ --exclude package-lock.json --exclude zip/ . ./zip && cd zip && npm install --production;
cd $basedir;
cd zip && zip -r ../code.zip ./ -x '*.git*' -x '*.zip' -x '.DS_Store' && cd ../ && rm -rf zip;
