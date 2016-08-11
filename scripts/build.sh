#!/bin/sh

babel src --out-dir lib

bell=`base64 ./audio/bell.ogg | tr -d '\n'`

echo "\n_resource2.default.add('hterm/audio/bell', 'audio/ogg;base64', '${bell}')" >> lib/hterm.js
