#!/bin/sh

# --batch to prevent interactive command
# --yes to assume "yes" for questions
GNUPGHOME=$(mktemp -d $HOME/.gnupgXXXXXX)
export GNUPGHOME
gpg --quiet --batch --yes --decrypt --passphrase="$ENV_PRODUCTION_SECRET_KEY" \
--output .env.production env.production.gpg
rm -rfi $GNUPGHOME