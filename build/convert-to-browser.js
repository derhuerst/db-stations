'use strict'

const fs = require('fs')
const path = require('path')
const ndjson = require('ndjson')
const sink = require('stream-sink')

const ndjsonToJSON = (src, dest) => {
	return fs.createReadStream(src)
	.pipe(ndjson.parse())
	.pipe(sink.object())
	.then((data) => new Promise((resolve, reject) => {
		data = JSON.stringify(data)
		fs.writeFile(dest, data, (err) => {
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
