'use strict'

// curl -s --fail --header 'Accept: application/json' --header 'Authorization: Bearer '$API_TOKEN 'https://api.deutschebahn.com/stada/v2/stations' -o build/data.json

const qs = require('querystring')
const {fetch} = require('fetch-ponyfill')()
const from = require('from2')

const endpoint = 'https://api.deutschebahn.com/stada/v2/stations'

const request = (token, offset, size) => {
	const url = endpoint + '?' + qs.stringify({offset, limit: size})
	return fetch(url, {
		headers: {
			authorization: 'Bearer ' + token,
			accept: 'application/json'
		},
		cache: 'no-store'
	})
	.then((res) => {
		if (!res.ok) throw new Error('non-2xx response')
		return res.json()
	})
}

const maxSize = 100

const download = (token) => {
	let offset = 0

	return from.obj((size, cb) => {
		size = Math.min(size, maxSize)
		offset += size

		request(token, offset, size)
		.then((data) => cb(null, data))
		.catch(cb)
	})
}

module.exports = download