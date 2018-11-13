# soloMVP

#Socket.io
![Vue Version](https://img.shields.io/badge/Vue.js-2.5.16-green.svg)
![Socket.io Version](https://img.shields.io/badge/Socket.io-2.1.1-green.svg)
![Postgres Version](https://img.shields.io/badge/Postgres-7.4.3-orange.svg)
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)

> Solo Project using Vue.js / Socket.io / Postgres / Heroku

- [Guidelines](#guidelines)
- [DB Schemas](#db-schemas)
- [Setup](#setup)
  - [Local Installation](#local-installation)
  - [Heroku Installation](#heroku-installation)

## Guidelines

This document provide a general documentationof how to use this project.

## DB Schemas

| Column  | Type    | Nullable | Default                               |
| ------- | ------- | -------- | ------------------------------------- |
| id      | integer | not null | nextval('locations_id_seq'::regclass) |
| name    | text    | not null |                                       |
| message | text    |          |                                       |
| channel | text    |          |                                       |

## Setup

### Local Installation

```sh
$ yarn -y
```

##### Database local installation

Create a Postgres database called _truckstop_ from you psql command line interface:

```sh
  CREATE DATABASE messages;
```

Then you need to migrate your table to match the correct schema using Knex migration file:

```sh
  yarn knex migrate:latest
```

Once the database table correctly created you can manually populate it, using Knex seeding file:

```sh
  yarn knex seed:run
```

### Heroku Installation

##### Install Heroku CLI globally.

```sh
$ yarn global add heroku
```

##### Login to Heroku.

```sh
$ heroku login
```

Set `NODE_ENV` for database migration and seed according to the `knexfiles.js`'s each environment to YOUR_APP.

```sh
$ heroku config:set NODE_ENV=staging --app YOUR_APP
$ heroku config --app truck-stops-staging
=== YOUR_APP Config Vars
NODE_ENV:     staging
```

##### Create a new PostgreSQL database on Heroku.

```sh
$ heroku addons:create heroku-postgresql:hobby-dev --app YOUR_APP
```

> **hobby-dev** can be replaced. `A created database cannot be accessed from the other app`.

Get database's access URL.

```sh
$ heroku config --app YOUR_APP
=== YOUR_APP Config Vars
DATABASE_URL: postgres://juxgeeffa ... o7ejoc
```

Replace `connection` in knexfile.js with `DATABASE_URL` above.

```js
  ...
  staging: {
    client: "postgresql",
    connection: "postgres://juxgee ... s88o7ejoc",
    pool: {
      min: 2,
      max: 10,
    },
  ...
```

Add `postinstall` to scripts in `package.json` as below then Heroku will run postinstall after deployment.

```json
  // more
  "scripts": {
      "start": "node server",
      "postinstall": "yarn vue-cli-service build && yarn knex migrate:latest && yarn knex seed:run",
      // more
```

Move some CLI packages of devDependencies to **dependencies**.

```json
  // more
  "dependencies": {
    "@vue/cli-plugin-babel": "^3.1.1",
    "@vue/cli-plugin-eslint": "^3.1.4",
    "@vue/cli-plugin-unit-mocha": "^3.1.1",
    "@vue/eslint-config-prettier": "^4.0.0",
    "@vue/cli-service": "^3.1.3",
    // more
```

Now commit and push all your codes to GitHub and deploy your app with GitHub's repository.
Then you will be happy.

> _NOTICE_: This command should be run after deploying YOUR_APP. Don't use `--env production` option because it didn't work.

## References

- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Socket.io](https://socket.io/docs)
