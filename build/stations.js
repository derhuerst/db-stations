'use strict'

const pipe = require('multipipe')
const fs = require('fs')
const path = require('path')
const csv = require('csv-parse')
const map = require('through2-map')



// todo: what is `Kat. Vst`?
const keys = {
	  id: (s) => +s['EVA_NR']
	, ds100: (s) => s['DS100'].toUpperCase()
	, name: (s) => s['NAME']
	, latitude: (s) => +s['BREITE']
	, longitude: (s) => +s['LAENGE']
}

const parse = (s) => {
	const r = {}
	for (let key in keys) r[key] = keys[key](s)
	return r
}



module.exports = pipe(
	  fs.createReadStream(path.join(__dirname, 'stations.csv'))
	, csv({delimiter: ';', columns: true})
	, map.obj(parse)
)
