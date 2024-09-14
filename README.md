# portfolio

[![On Push](https://github.com/shuklabhay/portfolio/actions/workflows/push.yml/badge.svg)](https://github.com/shuklabhay/portfolio/actions/workflows/push.yml/badge.svg)

## App Info

Personal portfolio.

![Home Page](src/static/home_page.png)

## Setup

- [Install](https://nodejs.org/en/download) Node.js 18 or higher
  - Confirm installation by running `node --version` in the command line
- [Install](https://docs.oracle.com/en/java/javase/20/install/overview-jdk-installation.html) Java JDK 11 or higher
  - Confirm installation by running `java --version` in the command line
- In the repo run `npm run setup`

## VSCode Setup

- Install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions
- In VSCode settings enable formatOnSave
- In VSCode settings select "Prettier - Code formatter" for the Default Formatter
- Setup a `.env` file with a variable `ACCESS_TOKEN=your_github_access_token`

## Development

- Run `npm run setup` to install dependencies
- Run `npm run dev` to start dev server
- Run `npm run lint` to format code and fix lint issues
