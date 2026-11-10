#!/bin/sh
# Renders the card's PNG previews and print PDF with headless Chrome.
# Run from brand/business-card:  sh tools/render.sh
set -e
HERE=$(cygpath -m "$(pwd)" 2>/dev/null || pwd)
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
PROFILE="${TMPDIR:-${TEMP:-/tmp}}/card-chrome-profile"
WORK=build
mkdir -p "$WORK"
python tools/build_print.py source assets ../../node_modules "$WORK"

wait_for() {
  n=0
  while [ ! -s "$1" ] && [ $n -lt 30 ]; do sleep 0.5; n=$((n + 1)); done
  [ -s "$1" ]
}

shot() { # page width height output
  rm -f "$4"
  "$CHROME" --headless=new --disable-gpu --no-first-run --hide-scrollbars \
    --user-data-dir="$PROFILE" --window-size="$2,$3" --virtual-time-budget=4000 \
    --screenshot="$HERE/$4" "file:///$HERE/$WORK/$1.html" 2>/dev/null
  wait_for "$4"
}

shot front 1360 756 jose-carter-card-front.png
shot back 1360 756 jose-carter-card-back.png
shot mockup 2000 1300 jose-carter-card-mockup.png

rm -f jose-carter-card-print.pdf
"$CHROME" --headless=new --disable-gpu --no-first-run --no-pdf-header-footer \
  --user-data-dir="$PROFILE" --virtual-time-budget=4000 \
  --print-to-pdf="$HERE/jose-carter-card-print.pdf" "file:///$HERE/$WORK/print.html" 2>/dev/null
wait_for jose-carter-card-print.pdf
ls -la jose-carter-card-*
