'use strict'

// curl -s --fail --header 'Accept: application/json' --header 'Authorization: Bearer '$API_TOKEN 'https://api.deutschebahn.com/stada/v2/stations' -o data.json

const qs = require('querystring')
const {fetch} = require('fetch-ponyfill')()
const concurrentThrough = require('through2-concurrent')

const estimateStationWeight = require('./estimate-station-weight')

const endpoint = 'https://api.deutschebahn.com/stada/v2/stations'

const request = (token, offset, size) => {
	const url = endpoint + '?' + qs.stringify({
		offset: 0, limit: 100000
	})
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
}

const maxIterations = 30
const weight0Msg = `\
has a weight of 0. Probably there are no departures here.`

const computeWeight = (s, _, cb) => {
	const id = s.evaNumbers[0] && s.evaNumbers[0].number
	if ('number' !== typeof id) return cb(null, s)

	estimateStationWeight(id + '', maxIterations)
	.then(weight => {
		if (weight === 0) console.error(id + '', s.name, weight0Msg)
		else s.weight = weight
		cb(null, s)
	})
	.catch((err) => {
		if (err.isHafasError) {
			console.error(id + '', s.name, err.message || (err + ''))
			cb()
		} else cb(err)
	})
}

const download = (token, setLength) => {
	const weight = concurrentThrough.obj({maxConcurrency: 10}, computeWeight)

	request(token)
	.then((data) => {
		setLength(data.result.length)
		for (let res of data.result) weight.write(res)
		weight.end()
	})
	.catch(err => weight.destroy(err))

	return weight
}

module.exports = download