#!/bin/bash

LOCAL_DIR="/Users/zairo/Library/Mobile Documents/com~apple~CloudDocs/Luca/codice/lucaairo.it/apache"
REMOTE_USER="root"
REMOTE_HOST="lucaairo.it"
REMOTE_DIR="/etc/apache2/sites-enabled"

scp "$LOCAL_DIR"/lucaairo.*.conf "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"