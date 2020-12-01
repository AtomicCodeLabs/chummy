#!/bin/sh

gpg --output env.production.gpg \
  --symmetric --cipher-algo AES256 .env.production
