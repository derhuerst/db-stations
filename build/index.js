'use strict'

const pipe = require('multipipe')
const through = require('through2')
const ndjson = require('ndjson')
const fs = require('fs')
const path = require('path')

const stations = require('./stations')
const parseFull = require('./parse-full')
const parseSimplified = require('./parse-simplified')

const TOKEN = process.env.API_TOKEN
if (!TOKEN) {
	process.stderr.write('missing API_TOKEN\n')
	process.exit(1)
}

const showError = (err) => {
	if (!err) return
	console.error(err)
	process.exit(1)
}

const src = pipe(
	stations(TOKEN),
	ndjson.parse(),
	through.obj(function (stations, _, cb) {
		for (let s of stations) this.push(s)
		cb()
	}),
	showError
)

pipe(
	src,
	parseSimplified(),
	ndjson.stringify(),
	fs.createWriteStream(path.join(__dirname, '../data.ndjson')),
	showError
)

pipe(
	src,
	parseFull(),
	ndjson.stringify(),
	fs.createWriteStream(path.join(__dirname, '../full.ndjson')),
	showError
)