# portfolio

[![Build Resume](https://github.com/shuklabhay/portfolio/actions/workflows/resume.yml/badge.svg)](https://github.com/shuklabhay/portfolio/actions/workflows/resume.yml)
[![On Push](https://github.com/shuklabhay/portfolio/actions/workflows/push.yml/badge.svg)](https://github.com/shuklabhay/portfolio/actions/workflows/push.yml/badge.svg)
[![Update GitHub Data](https://github.com/shuklabhay/portfolio/actions/workflows/ghdata.yml/badge.svg)](https://github.com/shuklabhay/portfolio/actions/workflows/ghdata.yml/badge.svg)

## App Info

Portfolio website, data repository and dynamic resume compiler

## Setup

- [Install](https://nodejs.org/en/download) Node.js 18 or higher
  - Confirm installation by running `node --version` in the command line
- [Install](https://docs.oracle.com/en/java/javase/20/install/overview-jdk-installation.html) Java JDK 11 or higher
  - Confirm installation by running `java --version` in the command line
- In the repo run `npm run setup`
- In the root directory create a `.env` file where `ACCESS_TOKEN=your_github_access_token`
- Run `npm run dev` to start the development application

## VSCode Setup

- Install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions
- In VSCode settings enable formatOnSave
- In VSCode settings select "Prettier - Code formatter" for the Default Formatter
- Setup a `.env` file with a variable `ACCESS_TOKEN=your_github_access_token`

## Development

- Run `npm run setup` to install dependencies
- Run `npm run dev` to start dev server
- Run `npm run lint` to format code and fix lint issues
- Run `npm run update-gh-data` to update JSON data from Gitub API
- Run `npm run compile-tex-resume` to compile JSON information into LaTeX template
