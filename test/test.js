'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

const expect = chai.expect;

chai.use(chaiHttp);


describe('Palindrome app', () => {

	//empty chars
	//weird chars (make an array of types)

	//limit of 10 elements
	//timout on the elements settable and tested
	

	it('returns 415 Unsupported Media Type if not text/plain', (done) => {
		chai.request(app)
			.post('/palindromes')
			.end((end, res) => {
				expect(res).to.have.status(415);
				done();
			});
	});

	it('returns 422 Unprocessable Entry if text/plain but not palindrome', (done) => {
		chai.request(app)
			.post('/palindromes')
			.set('content-type', 'text/plain')
			.send('notpalindrome')
			.end((end, res) => {
				expect(res).to.have.status(422);
				done();
			});
	});
});