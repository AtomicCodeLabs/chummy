# Project Structure

```txt
/
  .github/        <- github specific files (i.e., issue templates, workflow templates, ...)
  .vscode/        <- contains launch debug config for dev environment
  .scripts/       <- contains scripts for encrypting and decrypting env var's
  docs/           <- documentation (i.e., CONTRIBUTING, LICENSE, FAQ, ...)
  extension/      <- directory only exists on `master` branch. Contains files for extension web app.
  server/         <- directory only exists on `server` branch. Responsible for express server on AWS to serve website and extension assets
  website/        <- directory only exists on `website` branch. Contains files for extension launch website.
    src/

```

The above project structure breakdown should be enough to get you started. If you're interested in getting down to some of the technical nitty gritties, check out the sections below.

## Project Structure Explained

### Branches

This repository is separated into two branches, `master` and `website`.

- The master branch has an `extension/` folder at the root that contains the entire codebase of the extension.
- The `website` branch contains code for the React website in the `website/` folder.

### Tech Stack

#### Cloud

- Firebase Auth for user authentication
- Firebase Firestore for user data storage
- AWS S3 for storage of CDN's and secured credentials
- AWS Cloudfront for delivery of CDN's
- AWS EC2 to serve Jenkins server
- AWS Parameter Store for secure access of tokens
- Jenkins Docker-in-Docker solution for CI/CD

#### Local

- Webpack for bundling JS files
- Express as server framework
- React as extension web app framework
- Gatsby/React for website framework

We use Firebase Auth for authentication with a Github provider and Firebase Firestore to persist relevant information about users (i.e. keeping track of a user's bookmarks). React is used as the frontend framework for both the extension and the website to keep things consistent.

To keep things simple we use the standard development, testing, and production pattern for deployment, with one Firebase project for each stage. All firebase projects are configured in the exact same way to ensure consistent behavior. Although the website and extension codebases are different, they consume the same firebase projects as they must share user data between each other.

Because the extension is a browser extension, its entry point will look a little different from a regular old React web app. Chummy's entry point is a `popup.html` which gets loaded every time the extension [browser action](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction) button is clicked. The `popup.html` loads a script called `popup.js` which lets React render it's application into an existing div.

### Deployment

#### v1.0.1

We've homebrewed our own CI/CD server, and now use Jenkins on EC2!

In this version, we move on from Github actions to Jenkins on AWS to take more control over our pipelines. We serve an instance of Jenkins on an AWS EC2 instance which has IAM roles to fetch secret keys and .env files from S3 and Paramter Store. By doing so, we take away having to have any encrypt/decrypt logic sitting in the repository, and abstract it away into the cloud, which makes it tech stack agnostic in the scenario we change our minds and move on from Jenkins.

This process required that we automate the process for spinning up a pre-configured Jenkins docker image on AWS EC2. Credentials are retrieved via AWS CLI and copied into a volume that Jenkins and the EC2 host shares. We configured Jenkins so that it can execute builds on Docker node images (yes, you heard it right, it's Docker-ception) on all branches in the `alexkim205/chummy` repo that contain a `Jenkinsfile`.

#### v1.0.0

CI workflows to test and build the extension and build the website _separately_ are defined in the `.github/workflows` folder. In order to expose the production environment variables (Firebase project API and Github app API keys) to Github Actions, we use `gpg` per the official Github documentation [here](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets#limits-for-secrets). Encryption and decryption scripts are placed in the `./scripts/` folder so that local `./{extension|website}.env.production` files can be encrypted locally, pushed to the repository, and decrypted in the workflow with a Github secret. You might be wondering how any of your pull-requests are going to pass these workflow checks if you don't have access to these secrets. But rest assured, a successful build isn't contingent on having access to this secret key—-in other words, you won't need special privileges in order for pull-request build to succeed because the extension/website will build just fine without env keys.
