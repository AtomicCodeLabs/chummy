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

_In the case the above is out-of-date, the actual directory shouldn't deviate too far from this._

The above project structure breakdown should be enough to get you started. If you're interested in getting down to some of the technical nitty gritties, check out the sections below.

## Project Structure Explained

### Branches

This repository is separated into two branches, `master` and `website`.

- The master branch has an `extension/` folder at the root that contains the entire codebase of the extension.
- The `website` branch contains code for the React website in the `website/` folder.

### Tech Stack

#### Cloud

- **AWS Amplify Cognito** for federated user authentication
- **AWS DynamoDB** for user data storage
- **AWS S3** for storage of CDN's assets
- **AWS Cloudfront** for delivery of CDN's
- **AWS CodeBuild** for CI/CD
- **AWS Parameter Store** for secure access of tokens

#### Local

- **Webpack** for bundling JS files
- **Express** as server framework
- **React** as extension web app framework
- **Gatsby/React** for website framework
- **Docker** custom images for CI/CD

We use Amplify Cognito for authentication with a Github provider and DynamoDB to persist relevant information about users (i.e. keeping track of a user's bookmarks). React is used as the frontend framework for both the extension and the website to keep things consistent.

To keep things simple we use the standard development, gamma, and production pattern for deployment, with one Amplify project for each stage. All projects are configured in the exact same way to ensure consistent behavior. Although the website and extension codebases are different, they consume the same amplify environments to share user data between each other.

Chummy's entry point will look a little different from a regular old React web app because it is an extension. Chummy's entry point is a `popup.html` which gets loaded every time the extension [browser action](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction) button is clicked. The `popup.html` loads a script called `popup.js` which lets React render it's application into an existing div.

## Deployment

### Webpack

Webpack build configurations are slightly different across stages (dev/gamma/prod) and browser type (mozilla/chromium). They're differentiated into different config files defined in the `extension/webpack` directory. `{STAGE}.base.config.js` files contain the code that's shared between different configurations.

### CHANGELOG

#### `v1.0.0d`

A lot of work has been done to abstract the process of CI/CD so that we can focus on dev work.

We've separated our environments into three discrete environments (dev, gamma, and prod) for more robust testing and deployment. The gamma and prod versions exist as their separate branches on the public Github repo and one can be merged into the next one with manual promotion scripts available in the `package.json`. Once a manual promotion happens, an autohook will trigger AWS Codebuild to build that extension, run end-2-end tests, and publish the corresponding assets to S3 when everything looks good.

#### `v1.0.0c`

With the move away from Firebase to Amplify, we're moving away from Jenkins and using Amplify Console as a built in CI/CD solution. AWS Amplify takes care of environment variables that live securely in the AWS world, and we no longer need to bootstrap our own process of fetching credentials, passing them to Docker, passing them to the individual build images, and exposing them.

#### `v1.0.0b`

We've homebrewed our own CI/CD server, and now use Jenkins on EC2!

In this version, we move on from Github actions to Jenkins on AWS to take more control over our pipelines. We serve an instance of Jenkins on an AWS EC2 instance which has IAM roles to fetch secret keys and .env files from S3 and Parameter Store. By doing so, we take away having to have any encrypt/decrypt logic sitting in the repository, and abstract it away into the cloud, which makes it tech stack agnostic in the scenario we change our minds and move on from Jenkins.

This process required that we automate the process for spinning up a pre-configured Jenkins docker image on AWS EC2. Credentials are retrieved via AWS CLI and copied into a volume that Jenkins and the EC2 host shares. We configured Jenkins so that it can execute builds on Docker node images (yes, you heard it right, it's Docker-ception) on all branches in the `alexkim205/chummy` repo that contain a `Jenkinsfile`.

#### `v1.0.0a`

CI workflows to test and build the extension and build the website _separately_ are defined in the `.github/workflows` folder. In order to expose the production environment variables (Firebase project API and Github app API keys) to Github Actions, we use `gpg` per the official Github documentation [here](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets#limits-for-secrets). Encryption and decryption scripts are placed in the `./scripts/` folder so that local `./{extension|website}.env.production` files can be encrypted locally, pushed to the repository, and decrypted in the workflow with a Github secret. You might be wondering how any of your pull-requests are going to pass these workflow checks if you don't have access to these secrets. But rest assured, a successful build isn't contingent on having access to this secret key—-in other words, you won't need special privileges in order for pull-request build to succeed because the extension/website will build just fine without env keys.

## Browsers

As of January 9, 2020, Chummy is available on:

- Chrome
- Firefox
- Microsoft Edge
- Brave
- Opera

Work is being done to bring Chummy to:

- Safari

Using another browser you'd like to see Chummy on? Feel free to open a feature request!
