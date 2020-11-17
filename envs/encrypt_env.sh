#!/bin/sh

gpg --symmetric --cipher-algo AES256 \
  ./.env.production --output ./env.production.gpg
