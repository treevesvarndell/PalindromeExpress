'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const createStore = require('./palindromes').createStore

app.use(bodyParser.text())

// Routing
app.post('/palindromes', (req, res) => { 
	res.setHeader('Content-Type', 'application/json');
	if (req.get('content-type') === 'text/plain') {
		if (app.store.add(req.body)) {
    		res.send(JSON.stringify(true, null, 3));
		}
		else {
    		res.send(JSON.stringify(false, null, 3));
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