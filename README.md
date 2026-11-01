# Node.js Global Mentoring Program - Module 4 Testing

Link to [ebook](https://ebook.learn.epam.com/node-gmp/docs/testing/Homework).

## Getting started

1. Install the dependencies

```
npm install
```

2. Implement the task


## Practical task

You are working for a delivery company that has offices in Great Britain, Germany, France and the Netherlands. You are a part of backend team that focuses on building internal tools for that company. One day you received a new request from a customer to create a public holidays module. This module will:

- show a list of public holidays for specific country for the current year
- show the next public holiday for specific country
- show if today is public holiday in your location

After some time of investigation, you found [Nager.Date API](https://date.nager.at/swagger/index.html) that meets the requirements above. Your customer agreed to use it, so now you can start the development.

Once you’ve finished writing code, you have to cover your module with tests. The implementation can in this repository.

## Acceptance criteria

1. Jest is used for unit and integration tests, supertest - for E2E tests.
2. The module is covered with tests following instructions below:
   - Unit tests are written for public-holidays.service.ts and helpers.ts files. Keep in mind that any external calls are mocked in unit tests.
   - Integration tests are written for public-holidays.service.ts. Do not forget that in this case you make real calls to the API.
   - E2E tests are written for any two endpoints from Nager.Date API.
3. Code coverage is calculated, it is not less than 85%.
   - the `npm coverage` script is added to calculate the coverage.
   - Coverage Reporter[https://jestjs.io/docs/configuration#coveragereporters-arraystring--string-options] is cobertura: --coverageReporters=cobertura
   - Coverage directory(https://jestjs.io/docs/cli#--coveragedirectorypath) is a root directoty of the project: --coverageDirectory=.

   Script example: `jest --coverage --coverageReporters=cobertura --coverageDirectory=. --testPathPattern='.*\\.test\\.ts'`
4. The following npm scripts are added to run tests:
   - `npm test:unit` - to run unit tests
   - `npm test:integration` - to run integration tests
   - `npm test:e2e` - to run E2E tests

Note: npm script: `npm test`  should not be used as it is reserved for running internal tests on Autocode

## Evaluation criteria

- [x] Unit tests are written for public-holidays.service.ts and helpers.ts
- [x] Integration tests are written for public-holidays.service.ts
- [x] E2E tests are written for any two endpoints from Nager.Date API
- [x] Code coverage is calculated
- [x] Code coverage is not less than 85%
- [x] NPM scripts are added to run tests
