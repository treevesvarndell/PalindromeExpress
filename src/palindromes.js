'use strict'

class PalindromeStore {
	constructor(delay, refresh) { 
		this.palindromes = []
		this.setTimeout(delay, refresh)
	}

	currentDate() {
		return Date.now()
	}

	getAll() {
		return this.palindromes
	}

	clearAll() {
		this.palindromes = []
	}

	add(elem) {
		let p = this.palindromes
		if (!isPalindrome(elem)) {
		 	return false 
		} 
		else {
			if (p.length === 10) {
				let oldest = p.shift()
			}
			p.push({ "data": elem, "createdAt": this.currentDate()})
			this.palindromes = p
			return true
		}
	}

	setTimeout(delay, refresh) {
		setInterval(() => {
			let allElems = this.getAll()
		    allElems.forEach((item, idx) => {
		        if(this.currentDate() - delay >= item.createdAt) {
		            allElems.splice(idx, 1)
		        }
		    })
		}, refresh)
	}
}

function isPalindrome(str) {
	let formatted = str.replace(/\W/g, '').toLowerCase()
	if (formatted.length < 2) { 
		return false 
	} else { 
		return formatted === formatted.split("").reverse().join("") 
	}
}

module.exports = {
	createStore: function (delay, refresh) {
		return new PalindromeStore(delay, refresh)
	}
}