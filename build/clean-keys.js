'use strict'

const nonAscii = require('non-ascii')

const cleanKeys = (before) =>
	Object.keys(before)
	.reduce((after, key) => {
		after[key.replace(nonAscii, '')] = before[key]
		return after
	}, {})

module.exports = cleanKeys
