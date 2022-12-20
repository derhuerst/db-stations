import through from 'through2'
import slugg from 'slugg'
import omit from 'lodash/omit.js'

import {parseLocation, parseRil100, parseId} from './parse.js'

const createFullParser = () => {
	return through.obj((data, _, cb) => {
		const id = parseId(data)
		const additionalIds = data.evaNumbers
		.map((eva) => eva.number + '')
		.filter((additionalId) => additionalId !== id)

		cb(null, Object.assign({
			type: 'station',
			id,
			additionalIds,
			ril100: parseRil100(data), // a.k.a. RL100, a.k.a. DS100
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
		}, omit(data, [
			'number',
			'name',
			'mailingAddress',
			'aufgabentraeger',
			'evaNumbers'
		])))
	})
}

export {
	createFullParser as fullParser,
}