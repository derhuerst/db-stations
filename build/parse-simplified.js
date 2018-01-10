'use strict'

const through = require('through2')
const slugg = require('slugg')

const parseLocation = require('./parse').location
const parseDS100 = require('./parse').ds100
const parseId = require('./parse').id

const simplified = () => {
	return through.obj((data, _, cb) => {
		cb(null, {
			type: 'station',
			id: parseId(data),
			ds100: parseDS100(data),
			nr: data.number,
			name: data.name,
			weight: data.weight,
			location: parseLocation(data),
			operator: data.aufgabentraeger ? {
				type: 'operator',
				id: slugg(data.aufgabentraeger.name), // WAT
				name: data.aufgabentraeger.shortName
			} : null,
			address: data.mailingAddress
			// todo: parse Bundesland
		})
	})
}

module.exports = simplified