import {dirname, join as pathJoin} from 'node:path'
import {fileURLToPath} from 'node:url'
import pump from 'pump'
import progressStream from 'progress-stream'
import through from 'through2'
import ndjson from 'ndjson'
import fs from 'node:fs'
import ms from 'ms'

import {downloadAndWeightStations as getStations} from './stations.js'
import {fullParser as parseFull} from './parse-full.js'
import {simplifiedParser as parseSimplified} from './parse-simplified.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

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
	fs.createWriteStream(pathJoin(__dirname, '../data.ndjson')),
	showError
)

pump(
	src,
	parseFull(),
	ndjson.stringify(),
	fs.createWriteStream(pathJoin(__dirname, '../full.ndjson')),
	showError
)