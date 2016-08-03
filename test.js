'use strict'

const test = require('tape-catch')
const isStream = require('is-stream')

const stations = require('./index')



const isJungfernheide = (s) =>
	   s.id === 8011167
	&& s.nr === 3067
	&& s.ds100 === 'BJUF'
	&& s.name === 'Berlin Jungfernheide'
	&& s.latitude === 52.530276
	&& s.longitude === 13.299437



test('returns a stream', (t) => {
	t.plan(1)
	t.ok(isStream(stations()))
})

test('contains Berlin Jungfernheide', (t) => {
	t.plan(1)
	stations()
	.on('error', t.fail)
	.on('data', (s) => {
		if (isJungfernheide(s)) t.pass('contains Berlin Jungfernheide')
	})
})
