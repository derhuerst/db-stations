'use strict'

const through = require('through2')
const slugg = require('slugg')
const omit = require('lodash/omit')

const parseCoordinates = require('./parse').coordinates
const parseDS100 = require('./parse').ds100

const full = () => {
	return through.obj((data, _, cb) => {
		cb(null, Object.assign({
			type: 'station',
			id: data.evaNumbers[0] ? data.evaNumbers[0].number : null,
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
		}, omit(data, [
			'number',
			'name',
			'mailingAddress',
			'aufgabentraeger',
			'evaNumbers'
		])))
	})
}

module.exports = full