'use strict'

const createServer = require('./server').createServer
const app = createServer(60000, 1000)

app.listen(3000, () => {
	console.log(`App listening on port 3000!`)
})