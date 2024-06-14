#!/bin/sh
set -u
while true; do
    mac=$(nc -l -p "$PORT" | sed 's/[^a-fA-F0-9:]//g')
    awake "$mac"
done