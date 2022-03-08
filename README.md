# msp-nexttrip app

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Prerequisites:
  - Install Node.js and npm [here](https://nodejs.org/en/download/)
  - Clone repository

## Scripts to run application

In the project directory, you can run:

### `npm start`

To run the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

To run tests in interactive watch mode.

## Assumptions during development

  - Due to time constraints, application state is kept at the component level. Alternative (and my preferred) approach would be to manage state using Redux.
  - Again due to time constraints, a full test suite is not provided. Approach would be to continue the pattern of unit tests using react-testing-library and mocking API calls, and eventually incorporating end-to-end tests to simulate a user flow.
  - Current error handling is slim-to-none (console.log is a great way to handle errors, right??). Approach would be to display more useful error handling information to a user in the event of a failing API call.
  - Same as above with loading indication. Observed call times remain <200 ms, but displaying loading information could be helpful in the event of longer network response times.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
