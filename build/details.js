'use strict'

const pipe = require('multipipe')
const fs = require('fs')
const path = require('path')
const csv = require('csv-parse')
const map = require('through2-map')
const reduce = require('through2-reduce')



const states = {
	  'Baden-Württemberg': 'BW'
	, 'Bayern': 'BY'
	, 'Berlin': 'BE'
	, 'Brandenburg': 'BB'
	, 'Bremen': 'HB'
	, 'Hamburg': 'HH'
	, 'Hessen': 'HE'
	, 'Mecklenburg-Vorpommern': 'MV'
	, 'Niedersachsen': 'NI'
	, 'Nordrhein-Westfalen': 'NW'
	, 'Rheinland-Pfalz': 'RP'
	, 'Saarland': 'SL'
	, 'Sachsen': 'SN'
	, 'Sachsen-Anhalt': 'ST'
	, 'Schleswig-Holstein': 'SH'
	, 'Thüringen': 'TH'
}

// todo: what is `Kat. Vst`?
const keys = {
	  ds100: (s) => s['Bf DS 100 Abk.']
	, name: (s) => s['Station']
	, agency: (s) => s['Verkehrsverb.']
	, street: (s) => s['Straße']
	, zip: (s) => +s['PLZ']
	, city: (s) => s['Ort']
	, state: (s) => {
		const state = s['Bundesland']
		if (!(state in states)) console.error('unknown state ' + s['Bundesland'])
		return states[state]
	}
}

const parse = (s) => {
	const r = {}
	for (let key in keys) r[key] = keys[key](s)
	return r
}

const collect = (all = {}, s) => {
	all[s.ds100] = s
	return all
}



module.exports = pipe(
	  fs.createReadStream(path.join(__dirname, 'details.csv'))
	, csv({delimiter: ';', columns: true})
	, map.obj(parse)
	, reduce({objectMode: true}, collect)
)
