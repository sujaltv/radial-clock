#!/bin/sh

mkdir -p temp
cp index.html ./temp
cp styles.css ./temp
cp app.js ./temp
surge temp -d conferences.surge.sh
rm -r temp