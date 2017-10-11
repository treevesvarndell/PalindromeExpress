'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.text())

class Palindromes {
	constructor() { 
		this.palindromes = []
	}

	addElement(elem) {
		if (this.palindromes.length === 10) {
			console.log(`Palindrome limit of 10 reached, popping oldest element '${this.palindromes.pop().data}'`)
			this.palindromes.splice(-1,1)
		}
		this.palindromes.push(elem)
		console.log(`Length of array post-push: ${this.palindromes.length}`)
	}

	getAllElements() {
		return this.palindromes
	}
}

const palindromes = new Palindromes()

setInterval(() => {
	let allElems = palindromes.getAllElements()
    allElems.forEach((item, idx) => {
        if(Date.now() - 10000 > item.createdAt){
            allElems.splice(idx, 1)
        }
    })
}, 1000)

function isAPalindrome(str) {
	let temp = str.replace(/\W/g, '').toLowerCase()
	let reverse = temp.split("").reverse().join("")
	return temp === reverse
}

app.post('/palindromes', (req, res) => { 
	if (req.get('content-type') === 'text/plain') {
		let p = req.body
		if (isAPalindrome(p)) {
			palindromes.addElement({ "data": p, "createdAt": Date.now()})
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
	res.json(palindromes.getAllElements().map(p => p.data))
})

app.listen(8000, function () {
  console.log('App listening on port 8000!')
})

module.exports = app
