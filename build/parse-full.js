'use strict'

const through = require('through2')
const slugg = require('slugg')
const omit = require('lodash/omit')

const parseCoordinates = require('./parse').coordinates
const parseDS100 = require('./parse').ds100
const parseId = require('./parse').id

const full = () => {
	return through.obj((data, _, cb) => {
		const id = parseId(data)
		const additionalIds = data.evaNumbers
		.map((eva) => eva.number + '')
		.filter((additionalId) => additionalId !== id)

		cb(null, Object.assign({
			type: 'station',
			id,
			additionalIds,
			ds100: parseDS100(data),
			nr: data.number,
			name: data.name,
			weight: data.weight,
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