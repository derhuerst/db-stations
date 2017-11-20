'use strict'

const fs = require('fs')
const fromStr = require('from2-string')
const ndjson = require('ndjson')
const path = require('path')

const stationsFile = fs.readFileSync('data.ndjson', 'utf8')
const fullFile = fs.readFileSync('full.ndjson', 'utf8')

const read = (buf) => {
	const raw = fromStr(buf)
	const parser = ndjson.parse()
	raw.pipe(parser)
	return parser
}

const stations = () => read(stationsFile)
const full = () => read(fullFile)
stations.full = full

module.exports = stations
