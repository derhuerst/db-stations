import pump from 'pump'
import fs from 'node:fs'
import path from 'node:path'
import csv from 'csv-parser'
import map from 'through2-map'
import filter from 'stream-filter'
import reduce from 'through2-reduce'

const cleanKeys = () => {
	// todo
}

const hasUIC = (station) => station.uic && station.uic.length > 0

const hasDbId = (station) => station.db_id && station.db_id.length > 0

const collect = (all, station) => {
	all[station.uic] = station.db_id
	return all
}

const pBuild = pump(
	fs.createReadStream(path.join(__dirname, 'european.csv'))
	, csv({separator: ';'})
	, map.obj(cleanKeys)
	, filter(hasUIC, {objectMode: true})
	, filter(hasDbId, {objectMode: true})
	, reduce.obj(collect, {})
)

export {
	pBuild,
}
