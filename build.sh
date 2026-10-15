#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

rm -rf dist
mkdir -p dist/chromium dist/firefox

SHARED=(background.js options.html options.js popup.html popup.js offscreen.html offscreen.js icons)

for target in chromium firefox; do
  for f in "${SHARED[@]}"; do
    cp -R "$f" "dist/$target/$f"
  done
  cp "manifest.$target.json" "dist/$target/manifest.json"
done

# Firefox needs the polyfill shipped and loaded via its manifest; Chromium's
# background.js pulls it in itself at runtime via importScripts, only when
# running as a service worker.
cp browser-polyfill.js dist/firefox/browser-polyfill.js
cp browser-polyfill.js dist/chromium/browser-polyfill.js

cd dist/chromium && zip -rq ../spools-uploader-chromium.zip . && cd ../..
cd dist/firefox && zip -rq ../spools-uploader-firefox.zip . && cd ../..

echo "Built dist/chromium, dist/firefox, and both zips."
