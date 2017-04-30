'use strict'

const through = require('through2')
const slugg = require('slugg')

const parseCoordinates = require('./parse').coordinates

const simplified = () => {
	return through.obj((data, _, cb) => {
		cb(null, {
			type: 'station',
			id: data.evaNumbers[0] ? data.evaNumbers[0].number : null,
			ds100: null, // todo
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