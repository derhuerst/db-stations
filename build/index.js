'use strict'

const pipe = require('multipipe')
const progressStream = require('progress-stream')
const through = require('through2')
const ndjson = require('ndjson')
const fs = require('fs')
const path = require('path')
const ms = require('ms')

const getStations = require('./stations')
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

const reportProgress = (p) => {
	console.info([
		Math.round(p.percentage) + '%',
		'–',
		p.transferred + '/' + p.length,
		'–',
		Math.round(p.speed) + '/s',
		'–',
		'ETA: ' + (Number.isNaN(p.eta) ? '?' : ms(p.eta * 1000))
	].join(' '))
}

const progress = progressStream({objectMode: true})

const progressInterval = setInterval(() => {
	reportProgress(progress.progress())
}, 5 * 1000)
progress.once('end', () => clearInterval(progressInterval))
progress.once('error', () => clearInterval(progressInterval))

const stations = getStations(TOKEN, length => progress.setLength(length))

const src = pipe(
	stations,
	through.obj(function (s, _, cb) {
		const id = s.evaNumbers[0] ? s.evaNumbers[0].number + '' : null
		if (id) this.push(s)
		else console.error(`${s.name} (nr ${s.number}) has no IBNR`)
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