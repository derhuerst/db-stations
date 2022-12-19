'use strict'

const pump = require('pump')
const progressStream = require('progress-stream')
const through = require('through2')
const ndjson = require('ndjson')
const fs = require('fs')
const path = require('path')
const ms = require('ms')

const getStations = require('./stations')
const parseFull = require('./parse-full')
const parseSimplified = require('./parse-simplified')

const CLIENT_ID = process.env.DB_STADA_CLIENT_ID
if (!CLIENT_ID) {
	process.stderr.write('missing DB_STADA_CLIENT_ID\n')
	process.exit(1)
}
const CLIENT_SECRET = process.env.DB_STADA_CLIENT_SECRET
if (!CLIENT_SECRET) {
	process.stderr.write('missing DB_STADA_CLIENT_ID\n')
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
		'ETA: ' + (Number.isNaN(p.eta) || p.eta === Infinity ? '?' : ms(p.eta * 1000))
	].join(' '))
}

const progress = progressStream({objectMode: true})

const progressInterval = setInterval(() => {
	reportProgress(progress.progress())
}, 5 * 1000)
progress.once('end', () => clearInterval(progressInterval))
progress.once('error', () => clearInterval(progressInterval))

const stations = getStations(CLIENT_ID, CLIENT_SECRET, length => progress.setLength(length))

const src = pump(
	stations,
	progress,
	through.obj(function (s, _, cb) {
		const id = s.evaNumbers[0] ? s.evaNumbers[0].number + '' : null
		if (id) this.push(s)
		else console.error(`${s.name} (nr ${s.number}) has no IBNR`)
		cb()
	}),
	showError
)

pump(
	src,
	parseSimplified(),
	ndjson.stringify(),
	fs.createWriteStream(path.join(__dirname, '../data.ndjson')),
	showError
)

pump(
	src,
	parseFull(),
	ndjson.stringify(),
	fs.createWriteStream(path.join(__dirname, '../full.ndjson')),
	showError
)