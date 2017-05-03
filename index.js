'use strict'

const fs = require('fs')
const ndjson = require('ndjson')
const path = require('path')

const read = (file) => {
	const raw = fs.createReadStream(file)
	const parser = ndjson.parse()
	raw.pipe(parser)
	raw.on('error', (err) => parser.emit('error', err))
	return parser
}

const stations = () => read(path.join(__dirname, 'data.ndjson'))
const full = () => read(path.join(__dirname, 'full.ndjson'))
stations.full = full

module.exports = stations
