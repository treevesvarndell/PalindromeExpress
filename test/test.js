'use strict'

const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon')
const eventually = require('mocha-eventually')
const shallowDeepEqual = require('chai-shallow-deep-equal')

const expect = chai.expect
chai.use(chaiHttp)
chai.use(shallowDeepEqual)

const createServer = require('../src/server').createServer

const interval = 1000
const timeout = 2000 

describe('Server', () => {
	let app = createServer(timeout, interval)
	app.listen(8001)
	
	describe('POST /palindromes', () => {
		beforeEach(() => {
			app.store.clearAll()
		})
		
		it('returns true in JSON if text/plain and is palindrome', (done) => {
			chai.request(app)
				.post('/palindromes')
				.set('content-type', 'text/plain')
				.send('pop')
				.end((end, res) => {
					expect(res).to.have.status(200)
					expect(res.body).to.equal(true)
					done()
				})
		})

		it('returns false in JSON if text/plain but not palindrome', (done) => {
			chai.request(app)
				.post('/palindromes')
				.set('content-type', 'text/plain')
				.send("Hey,yehh")
				.end((end, res) => {
					expect(res).to.have.status(200)
					expect(res.body).to.equal(false)
					done()
				})
		})

		it('returns 415 Unsupported Media Type if not text/plain', (done) => {
			chai.request(app)
				.post('/palindromes')
				.end((end, res) => {
					expect(res).to.have.status(415)
					done()
				})
		})
	})

	describe('GET /palindromes', () => {
		beforeEach(() => {
			app.store.clearAll()
		})

		it('returns empty array when initialised', (done) => {
			chai.request(app)
				.get('/palindromes')
				.end((end, res) => {
					expect(res.body).to.eql([])
					done()
				})
		})

		it('returns a palindrome when one present', (done) => {
			app.store.add("Hey,yeh")

			chai.request(app)
				.get('/palindromes')
				.end((end, res) => {
					expect(res.body).to.eql(['Hey,yeh'])
					done()
				})
		})

		it('returns multiple elements as list when present in store', (done) => {
			app.store.add("1Hey,yeh1")
			app.store.add("2Hey,yeh2")
			app.store.add("3Hey,yeh3")
			
			chai.request(app)
				.get('/palindromes')
				.end((end, res) => {
					expect(res.body).to.eql([
						'1Hey,yeh1',
						'2Hey,yeh2',
						'3Hey,yeh3'
					])
					done()
				})
		})
	})
})

describe('Palindrome store', () => {

	const createStore = require('../src/palindromes').createStore

	describe('add()', () => {
		let store = createStore(timeout, interval)
		
		beforeEach(() => {
			store.clearAll()
		})

		it('returns true if a palindrome two chars or more', (done) => {
			expect(store.add('aa')).to.be.equal(true)
			done()
		})

		it('returns false if less than two chars', (done) => {
			expect(store.add('a')).to.be.equal(false)
			done()
		})

		it('returns false if not a palindrome', (done) => {
			expect(store.add('ab')).to.be.equal(false)
			done()
		})

		it('ignores all other chars other than alphanumerical', (done) => {
			expect(store.add("a!!''%%%%''!!a)")).to.be.equal(true)
			expect(store.add("a!!''%%b%%''!!a)")).to.be.equal(true)
			expect(store.add("!!''%%''!!)")).to.be.equal(false)
			done()
		})

		it('ignores case', (done) => {
			expect(store.add("aazbaABZAA)")).to.be.equal(true)
			done()
		})

		it('adds up to 10 elements and pops oldest element if limit reached', (done) => {
			store.add('Tobepopebot')
			for (var i = 0; i <= 9; i++) {
				store.add(`${i}elemele${i}`)
			}
			expect(store.getAll()).to.shallowDeepEqual([
				{"data": "0elemele0"},
				{"data": "1elemele1"},
				{"data": "2elemele2"},
				{"data": "3elemele3"},
				{"data": "4elemele4"},
				{"data": "5elemele5"},
				{"data": "6elemele6"},
				{"data": "7elemele7"},
				{"data": "8elemele8"},
				{"data": "9elemele9"}
			])
			done()
		})
	})

	describe('getAll()', () => {
		let store 

		beforeEach(() => {
			store = createStore(timeout, interval)
		})

		it('returns an empty array if there are no elements stored', (done) => {
			expect(store.getAll()).to.eql([])
			done()
		})

		it('doesnt store an element if it is not a palindrome', (done) => {
			store.add('not a tonne')
			expect(store.getAll()).to.eql([])
			done()
		})
	})

	describe('timeout of elements in store', () => {
		let store 

		beforeEach(() => {
			this.clock = sinon.useFakeTimers()
			store = createStore(timeout, interval)
		})

		afterEach(() => {
			this.clock.restore()
		})

		it('keeps elements for as long as the timeout passed into the store', (done) => {
			let stub = sinon.stub(store, "currentDate")

			stub.callsFake(() => { return new Date(0) })
			
			store.add('aa')
			expect(store.getAll()).to.eql([
				{"data": "aa", "createdAt": new Date(0)}
			])

			stub.callsFake(() => { return new Date(1000) })
			this.clock.tick(1000)
			
			store.add('bb')
			expect(store.getAll()).to.eql([
				{"data": "aa", "createdAt": new Date(0)}, 
				{"data": "bb", "createdAt": new Date(1000)}
			])
			
			stub.callsFake(() => { return new Date(2000) })
			this.clock.tick(1000)

			expect(store.getAll()).to.eql([
				{"data": "bb", "createdAt": new Date(1000)}
			])

			stub.callsFake(() => { return new Date(3000) })
			this.clock.tick(1000)

			expect(store.getAll()).to.eql([])

			done()
		})
	})
})