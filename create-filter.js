'use strict'

const tokenize = require('tokenize-db-station-name')

const createFilter = (sel) => {
	if (sel === 'all') return () => true

	const props = Object.keys(sel)
	const selTokens = 'string' === typeof sel.name
		? tokenize(sel.name)
		: []

	const filter = (s) => {
		for (let i = 0; i < props.length; i++) {
			const prop = props[i]

			if (prop === 'name') {
				const sTokens = tokenize(s.name)
				// check if selTokens is a subset of sTokens
				for (let i = 0; i < selTokens.length; i++) {
					if (sTokens.indexOf(selTokens[i]) < 0) return false
				}
			} else if (prop === 'latitude') {
				if (
					s.location && sel.location &&
					s.location.latitude !== sel.location.latitude
				) return false
			} else if (prop === 'longitude') {
				if (
					s.location && sel.location &&
					s.location.longitude !== sel.location.longitude
				) return false
			} else if (s[prop] !== sel[prop]) {
				return false
			}
		}

		return true
	}
	return filter
}

module.exports = createFilter
