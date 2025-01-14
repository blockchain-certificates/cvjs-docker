#!/usr/bin/env bash

rm .version
echo "new version: $1"
echo $1 > .version
echo "file written: $(cat .version)"
