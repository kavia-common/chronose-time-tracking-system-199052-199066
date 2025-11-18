#!/bin/bash
cd /home/kavia/workspace/code-generation/chronose-time-tracking-system-199052-199066/chronose_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

