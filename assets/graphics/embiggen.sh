#!/bin/bash

for f in $(ls -1 *.png | grep -v ^_); do
  echo "${f} to _${f}"
  convert ${f} -filter point -resize 400% _${f}
done
