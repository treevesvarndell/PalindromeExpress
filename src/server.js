'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const createStore = require('./palindromes').createStore

app.use(bodyParser.text())

// Routing
app.post('/palindromes', (req, res) => { 
	if (req.get('content-type') === 'text/plain') {
		if (app.store.add(req.body)) {
			res.sendStatus('201')
		}
		else {
			res.sendStatus('422')
		}
	}
	else {
		res.sendStatus('415')
	}
})

app.get('/palindromes', function(req, res) {
	res.json(app.store.getAll().map(p => p.data))
})

// App Export
module.exports = {
	createServer: (delay) => {
		app.store = createStore(delay)
		return app
	}
}