# [Chummy](https://www.chummy.atomiccode.io) - The Missing Github Extension

<div style="display: flex;justify-content: center;">
  <img src="https://i.imgur.com/CalZtQe.gif" style="margin-bottom: 1rem;"/>
</div>

<p align="center" style="margin-bottom: 1rem;">
  <a href="https://chrome.google.com/webstore/detail/chummy/ocmdenamdoeigigibgjfnconlhpekfgb">  
    <img alt="Chrome" src="https://img.shields.io/badge/chrome-4C8BF5?style=for-the-badge&logo=google-chrome&logoColor=FFFFFF" />
  </a>
  <a href="https://addons.mozilla.org/en-US/firefox/addon/chummy/">  
    <img alt="Firefox" src="https://img.shields.io/badge/firefox-ff9400?style=for-the-badge&logo=firefox&logoColor=FFFFFF" />
  </a>
  <a href="https://microsoftedge.microsoft.com/addons/detail/bpobpfbpikaikajipjoaoiijnkjikpfe">
    <img alt="Microsoft Edge" src="https://img.shields.io/badge/edge-3277BC?style=for-the-badge&logo=microsoft-edge&logoColor=FFFFFF" />
  </a>
  <a href="https://addons.opera.com/en/extensions/details/chummy/">
    <img alt="GitHub last commit" src="https://img.shields.io/badge/opera-FF1B2D?style=for-the-badge&logo=opera&logoColor=FFFFFF" />
  </a>
</p>

<p align="center">
  <a href="http://commitizen.github.io/cz-cli/">  
    <img alt="Commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square" />
  </a>
  <a href="">  
    <img alt="Github stars" src="https://img.shields.io/github/stars/AtomicCodeLabs/chummy?style=flat-square" />
  </a>
  <a href="">
    <img alt="Github forks" src="https://img.shields.io/github/forks/AtomicCodeLabs/chummy?style=flat-square" />
  </a>
  <a href="">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/AtomicCodeLabs/chummy?style=flat-square" />
  </a>
  <a href="">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/AtomicCodeLabs/chummy?style=flat-square" />
  </a>
  <a href="">
    <img alt="License" src="https://img.shields.io/github/license/AtomicCodeLabs/chummy?style=flat-square" />
  </a>
</p>

---

## Table of Contents

- [⏱️ Quick Links](#️-quick-links)
- [🦕 What is Chummy?](#-what-is-chummy)
- [🚀 Core Features](#-core-features)
  - [📓 Repository Management](#-repository-management)
  - [🗂️ Tab Management](#️-tab-management)
  - [🌲 Project Tree](#-project-tree)
  - [🔍 Powerful Search](#-powerful-search)
  - [🔖 Bookmarks](#-bookmarks)
  - [🌙 Distraction Free Mode](#-distraction-free-mode)
  - [🎨 Light and Dark Themes](#-light-and-dark-themes)
  - [🩹 Sticky Window](#-sticky-window)
- [❓ Why use Chummy?](#-why-use-chummy)
- [✊ Motivation](#-motivation)
- [📟 Tech Stack](#-tech-stack)
  - [Dependencies](#dependencies)

---

## ⏱️ Quick Links

**🏠 [Home Website](https://www.chummy.atomiccode.io)**

**📹 [90 second demo](https://www.youtube.com/watch?v=sKid01-p09s)**

**🎯 [Product Hunt](https://www.producthunt.com/posts/chummy-3)**

**💻 [Indie Hackers](https://www.indiehackers.com/product/chummy)**

**📧 [hello@atomiccode.io](mailto:hello@atomiccode.io)**

## 🦕 What is Chummy?

Don't want to clone another Github repository just to browse its contents? Github's clunky browsing interface slowing you down? Having a bad time, overall? Chummy is a browser extension for Github that helps you use Github quickly and efficiently. Get started in just one click!

Learn more about what Chummy has to offer at [chummy.atomiccode.io](https://www.chummy.atomiccode.io).

## 🚀 Core Features

### 📓 Repository Management

<img src="https://i.imgur.com/dhQNFp2.gif"/>

### 🗂️ Tab Management

<img src="https://i.imgur.com/F3pfVlW.gif"/>

### 🌲 Project Tree

<img src="https://i.imgur.com/CRGju8L.gif" height="500"/>

### 🔍 Powerful Search

<img src="https://i.imgur.com/FOXvqQJ.gif" height="500"/>

### 🔖 Bookmarks

<img src="https://i.imgur.com/LWp8hTp.gif" height="500"/>

### 🌙 Distraction Free Mode

<img src="https://i.imgur.com/D1JBmZk.gif"/>

### 🎨 Light and Dark Themes

<img src="https://i.imgur.com/GGKVDhs.gif" height="500"/>

### 🩹 Sticky Window

<img src="https://i.imgur.com/ILbZ4cg.gif" />

### + more [here](https://www.chummy.atomiccode.io/)!

## ❓ Why use Chummy?

1. **_One Click Setup_** - Use your existing Github account. No sign up, no credit card required to get started.
2. **_Cross Browser Compatible_** - Available on your favorite browsers. Support for Safari coming soon!
3. **_Simple and Flexible_** - A simple and clean user experience with modular features makes the app a joy to use.

## ✊ Motivation

Read [MOTIVATION.md](https://github.com/AtomicCodeLabs/chummy/blob/docs/docs/MOTIVATION.md).

## 📟 Tech Stack

- **Webpack** for bundling JS files
- **Express** as server framework
- **React** as extension web app framework
- **MobX** for state management in the extension
- **Gatsby/React** for website framework

### Dependencies

- **AWS Amplify Cognito** for federated user authentication
- **AWS DynamoDB** for user data storage
- **AWS S3** for storage of CDN's assets
- **AWS Cloudfront** for delivery of CDN's
- **AWS CodeBuild** for CI/CD
- **AWS Lambda** for serverless API
- **AWS API Gateway** for exposing Lambda functions
- **AWS Parameter Store** for secure access of tokens
- **Stripe** for payments integration
