'use strict'

const tokenize = require('tokenize-db-station-name')

const createFilter = (sel) => {
	if (sel === 'all') return () => true

	const selTokens = sel.name ? tokenize(sel.name) : []

	const filter = (s) => {
		if (('id' in sel) && s.id !== sel.id) return false
		if (('weight' in sel) && s.weight !== sel.weight) return false

		if ('latitude' in sel) {
			if (!s.coordinates) return false
			if (s.coordinates.latitude !== sel.latitude) return false
		}
		if ('longitude' in sel) {
			if (!s.coordinates) return false
			if (s.coordinates.longitude !== sel.longitude) return false
		}

		if ('name' in sel) {
			const sTokens = tokenize(s.name)
			// check if selTokens is a subset of sTokens
			for (let i = 0; i < selTokens.length; i++) {
				if (sTokens.indexOf(selTokens[i]) < 0) return false
			}
		}

		return true
	}
	return filter
}

module.exports = createFilter
