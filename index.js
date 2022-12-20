import {dirname, join as pathJoin} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createReadStream} from 'node:fs'
import ndjson from 'ndjson'

const __dirname = dirname(fileURLToPath(import.meta.url))

const read = (file) => {
	const raw = createReadStream(file)
	const parser = ndjson.parse()
	raw.pipe(parser)
	raw.on('error', (err) => parser.emit('error', err))
	return parser
}

const readStations = () => {
	return read(pathJoin(__dirname, 'data.ndjson'))
}
const readFullStations = () => {
	return read(pathJoin(__dirname, 'full.ndjson'))
}

export {
	readStations,
	readFullStations,
}
