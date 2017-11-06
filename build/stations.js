'use strict'

// curl -s --fail --header 'Accept: application/json' --header 'Authorization: Bearer '$API_TOKEN 'https://api.deutschebahn.com/stada/v2/stations' -o build/data.json

const throttle = require('p-throttle')
const qs = require('querystring')
const {fetch} = require('fetch-ponyfill')()
const from = require('from2')
const through = require('through2')

const endpoint = 'https://api.deutschebahn.com/stada/v2/stations'

const request = throttle((token, offset, size) => {
	const url = endpoint + '?' + qs.stringify({offset, limit: size})
	return fetch(url, {
		headers: {
			authorization: 'Bearer ' + token,
			accept: 'application/json'
		},
		cache: 'no-store'
	})
	.then((res) => {
		if (!res.ok) {
			const err = new Error('non-2xx response')
			err.statusCode = res.status
			throw err
		}
		return res.json()
	})
}, 100, 61 * 1000) // 100 reqs/min + cushion

const maxSize = 100

const download = (token) => {
	let offset = 0
	let total = Infinity

	return from.obj((_, cb) => {
		console.error(`${offset} of ${total} total`)
		if (offset >= total) return cb(null, null)
		const size = Math.min(maxSize, total - offset)

		request(token, offset, size)
		.then((data) => {
			total = data.total
			cb(null, data.result)
		})
		.catch(cb)

		offset += size
	})
	.pipe(through.obj(function (stations, _, cb) {
		for (let s of stations) this.push(s)
		cb()
	}))
}

module.exports = download