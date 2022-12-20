import {dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createReadStream, writeFile} from 'node:fs'
import path from 'node:path'
import ndjson from 'ndjson'
import sink from 'stream-sink'

const __dirname = dirname(fileURLToPath(import.meta.url))

const ndjsonToJSON = (src, dest) => {
	return createReadStream(src)
	.pipe(ndjson.parse())
	.pipe(sink.object())
	.then((data) => new Promise((resolve, reject) => {
		data = JSON.stringify(data)
		writeFile(dest, data, (err) => {
			if (err) reject(err)
			else resolve()
		})
	}))
}

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const d = path.join(__dirname, '..')
ndjsonToJSON(path.join(d, 'data.ndjson'), path.join(d, 'data.json'))
.catch(showError)

ndjsonToJSON(path.join(d, 'full.ndjson'), path.join(d, 'full.json'))
.catch(showError)
