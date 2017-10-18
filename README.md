## Palindrome Service

A service that stores palindromes. A palindrome is a word or phrase string that reads the same backwards as forwards, independent of spaces and punctuation. An example could be 'Dammit I'm Mad'.

The service has a simple REST interface that presents two endpoints:

##  POST /palindromes

An endpoint that accepts a string parameter in its body as text/plain, that will return true if the string is palindrome (and false otherwise)

## GET /palindromes 

An endpoint that returns a list of the last 10 palindromes the system has received in the last 10 minutes (there is no need to persist the palindromes, it is OK to keep them in memory)


### How to run

Install yarn for simplest process

- Navigate to root folder
- Start app - `yarn start` or `node src/app.js`
- Test app - `yarn test` or `mocha test/test.js`
