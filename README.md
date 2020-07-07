# TDD Demo API

A demo project for my thesis about developing a web application in test-driven style. This RESTful API provides login and signup routes, and CRUD routes for events board.

The web client that this API is developed for can be found [here](https://github.com/jarm111/tdd-demo-client).

The API is tested on integration level with Jest and SuperTest.

## Powered by

- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/en/)
- [Express](http://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Jest](https://jestjs.io/)
- [SuperTest](https://github.com/visionmedia/supertest)

## Getting started

- clone the repo with `git clone`
- `npm install` to install dependencies
- add `.env` file with suitable content to the project root
- `npm start` to start the server in production mode
- `npm run watch` to start the server in development mode
- `npm test` to launch test runner

## Example .env file content

```
PORT=4000
MONGODB_URL_DEV=your-mongodb-connection-string-for-development
MONGODB_URL_PROD=your-mongodb-connection-string-for-production
SECRET=your-secret-for-jwt
SALT=10
PASSWORD_MIN_LENGTH=8
```
