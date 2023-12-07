#!/bin/sh

if [ "$RUN_MODE" = "dev" ]; then
  npm run dev
else
  npm run build && npm start
fi
