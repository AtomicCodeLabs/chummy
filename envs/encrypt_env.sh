#!/bin/sh

gpg --symmetric --cipher-algo AES256 \
  ../envs/.env.production --output ../envs/env.production.gpg
