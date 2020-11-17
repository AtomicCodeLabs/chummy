# Project Structure

```txt
/
  .github/        <- github specific files (i.e., issue templates, workflow templates, ...)
  .docs/          <- documentation (i.e., CONTRIBUTING, LICENSE, FAQ, ...)
  .scripts/       <- contains scripts for encrypting and decrypting env var's
  .extension/     <- directory only exists only on `master` branch

  .website/       <- directory only exists only on `website` branch
    src/

```

The above project structure breakdown should be enough to get you started. If you're interested in getting down to some of the technical nitty gritties, check out the sections below.

## Project Structure Explained

### Branches

This repository is separated into two branches, `master` and `website`.

- The master branch has an `extension/` folder at the root that contains the entire codebase of the extension.
- The `website` branch contains code for the React website in the `website/` folder.

### Tech Stack

We use Firebase Auth for authentication with a Github provider and Firebase Firestore to persist relevant information about users (i.e. keeping track of a user's bookmarks). React is used as the frontend framework for both the extension and the website to keep things consistent.

To keep things simple we use the standard development, testing, and production pattern for deployment, with one Firebase project for each stage. All firebase projects are configured in the exact same way to ensure consistent behavior. Although the website and extension codebases are different, they consume the same firebase projects as they must share user data between each other.

Because the extension is a browser extension, its entry point will look a little different from a regular old React web app. Chummy's entry point is a `popup.html` which gets loaded every time the extension [browser action](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction) button is clicked. The `popup.html` loads a script called `popup.js` which lets React render it's application into an existing div.

### Deployment

CI workflows to test and build the extension and build the website _separately_ are defined in the `.github/workflows` folder. In order to expose the production environment variables (Firebase project API and Github app API keys) to Github Actions, we use `gpg` per the official Github documentation [here](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets#limits-for-secrets). Encryption and decryption scripts are placed in the `./scripts/` folder so that local `./{extension|website}.env.production` files can be encrypted locally, pushed to the repository, and decrypted in the workflow with a Github secret. You might be wondering how any of your pull-requests are going to pass these workflow checks if you don't have access to these secrets. But rest assured, a successful build isn't contingent on having access to this secret key—-in other words, you won't need special privileges in order for pull-request build to succeed because the extension/website will build just fine without env keys.
