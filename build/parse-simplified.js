import through from 'through2'
import slugg from 'slugg'

import {parseLocation, parseRil100, parseId} from './parse.js'

const createSimplifiedParser = () => {
	return through.obj((data, _, cb) => {
		cb(null, {
			type: 'station',
			id: parseId(data),
			ril100: parseRil100(data),
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

export {
	createSimplifiedParser as simplifiedParser,
}