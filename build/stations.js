import createDebug from 'debug'
import qs from 'querystring'
import createFetch from 'fetch-ponyfill'
import concurrentThrough from 'through2-concurrent'

import {estimateStationWeight} from './estimate-station-weight.js'

const {fetch} = createFetch()
const debug = createDebug('db-stations:stations')

const endpoint = 'https://apis.deutschebahn.com/db-api-marketplace/apis/station-data/v2/stations'

const request = (clientId, clientSecret) => {
	debug('fetching stations')

	const url = endpoint + '?' + qs.stringify({
		offset: 0, limit: 100000
	})
	return fetch(url, {
		headers: {
			'DB-Client-Id': clientId,
			'DB-Api-Key': clientSecret,
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

const maxIterations = 50
const weight0Msg = `\
has a weight of 0. Probably there are no departures here.`

const computeWeight = (s, _, cb) => {
	const id = s.evaNumbers[0] && s.evaNumbers[0].number
	if ('number' !== typeof id) return cb(null, s)

	estimateStationWeight(id + '', maxIterations)
	.then(weight => {
		if (weight === 0) console.error(id + '', s.name, weight0Msg)
		else {
			debug(`estimated weight ${weight} for ${id}`)
			s.weight = weight
		}
		cb(null, s)
	})
	.catch((err) => {
		if (err.isHafasError) {
			console.error(id + '', s.name, err.message || (err + ''))
			cb()
		} else cb(err)
	})
}

const downloadAndWeightStations = (clientId, clientSecret, setLength) => {
	const weight = concurrentThrough.obj({maxConcurrency: 10}, computeWeight)

	request(clientId, clientSecret)
	.then((data) => {
		setLength(data.result.length)
		for (let res of data.result) weight.write(res)
		weight.end()
	})
	.catch(err => weight.destroy(err))

	return weight
}

export {
	downloadAndWeightStations,
}