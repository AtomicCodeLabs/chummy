#!/bin/sh

# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$ENV_PRODUCTION_SECRET_KEY" \
--output ../extension/.env.production ../env.production.gpg