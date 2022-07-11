## Pre-requisites

To setup and run the project for local development / testing, you will need to have Node.js and YARN installed.

Installers can be found here: [https://nodejs.org/en/download] and [https://yarnpkg.com/]

## Installation

The code of the project can be found at the public [GitHub](https://github.com/) repo [https://github.com/nilu2039/pet-perfect](https://github.com/nilu2039/pet-perfect). Either clone the repo to a local folder on your machine or download and extract the archive if you don't have [Git](https://git-scm.com/) installed.

Open a terminal window session, or the equivalent on your machine, and enter the following command to install all the Node modules needed to run the app:

```sh
yarn
```

## Run the app in development mode

After doing `yarn` enter the following command `yarn watch` to convert the typescript files to javascript, and in a new terminal session run :

```sh
yarn dev
```

This will start the app and set it up to listen for incoming connections on port 5000. The `yarn dev` command automatically runs the app using the `nodemon` script so any changes you make to the apps will automatically restart it.
