'use strict'

const pipe = require('multipipe')
const map = require('through2-map')
const ndjson = require('ndjson')
const fs = require('fs')
const path = require('path')

const details = require('./details')
const stations = require('./stations')



details.on('error', console.error)
.on('data', (details) => {

	pipe(

		  stations
		, map.obj((station) => details[station.ds100]
			? Object.assign({}, details[station.ds100], station)
			: station)
		, ndjson.stringify()
		, fs.createWriteStream(path.join(__dirname, '../data.ndjson'))

	).on('error', console.error)
})
