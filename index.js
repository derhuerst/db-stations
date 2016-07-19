'use strict'

const path = require('path')
const pipe = require('multipipe')
const fs = require('fs')
const ndjson = require('ndjson')



const file = path.join(__dirname, 'data.ndjson')
const stations = () => {
	const one = fs.createReadStream(file)
	const two = ndjson.parse()
	one.pipe(two)
	one.on('error', (e) => two.emit('error', e))
	return two
}

module.exports = stations
