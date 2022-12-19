'use strict'

const pump = require('pump')
const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')
const map = require('through2-map')
const filter = require('stream-filter')
const reduce = require('through2-reduce')

const cleanKeys = () => {
	// todo
}

const hasUIC = (station) => station.uic && station.uic.length > 0

const hasDbId = (station) => station.db_id && station.db_id.length > 0

const collect = (all, station) => {
	all[station.uic] = station.db_id
	return all
}

module.exports = pump(
	fs.createReadStream(path.join(__dirname, 'european.csv'))
	, csv({separator: ';'})
	, map.obj(cleanKeys)
	, filter(hasUIC, {objectMode: true})
	, filter(hasDbId, {objectMode: true})
	, reduce.obj(collect, {})
)
