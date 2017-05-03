'use strict'

const through = require('through2')
const slugg = require('slugg')

const parseCoordinates = require('./parse').coordinates
const parseDS100 = require('./parse').ds100

const simplified = () => {
	return through.obj((data, _, cb) => {
		const id = data.evaNumbers[0] ? data.evaNumbers[0].number + '' : null
		cb(null, {
			type: 'station',
			id,
			ds100: parseDS100(data),
			nr: data.number,
			name: data.name,
			coordinates: parseCoordinates(data),
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