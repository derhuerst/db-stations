'use strict'

// curl -s --fail --header 'Accept: application/json' --header 'Authorization: Bearer '$API_TOKEN 'https://api.deutschebahn.com/stada/v2/stations' -o build/data.json

const throttle = require('p-throttle')
const qs = require('querystring')
const {fetch} = require('fetch-ponyfill')()
const from = require('from2')
const through = require('through2')
const concurrentThrough = require('through2-concurrent')
const _computeWeightOf = require('compute-db-station-weight')
const progressStream = require('progress-stream')

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

const computeWeightOf = throttle(_computeWeightOf, 500, 61 * 1000) // 500 reqs/min + cushion
const weight0Msg = `\
has a weight of 0. Probably there are no departures here.`

const computeWeight = (s, _, cb) => {
	const id = s.evaNumbers[0] && s.evaNumbers[0].number
	if ('number' !== typeof id) return cb(null, s)

	computeWeightOf(id + '')
	.then(weight => {
		if (weight === 0) console.error(id + '', s.name, weight0Msg)
		else s.weight = weight
		cb(null, s)
	})
	.catch((err) => {
		if (err.isHafasError) {
			console.error(id + '', s.name, err.message || (err + ''))
		} else cb(err)
	})
}

const maxSize = 100

const download = (token) => {
	let offset = 0
	let total = Infinity

	const progress = progressStream({objectMode: true, time: 5 * 1000})

	return from.obj((_, cb) => {
		if (offset >= total) return cb(null, null)
		const size = Math.min(maxSize, total - offset)

		request(token, offset, size)
		.then((data) => {
			total = data.total
			progress.setLength(total)
			cb(null, data.result)
		})
		.catch(cb)

		offset += size
	})
	.pipe(through.obj(function (stations, _, cb) {
		for (let s of stations) this.push(s)
		cb()
	}))
	.pipe(concurrentThrough.obj({maxConcurrency: 10}, computeWeight))
	.pipe(progress)
}

module.exports = download