'use strict'

const test = require('tape-catch')
const isStream = require('is-stream')

const stations = require('./index')



const isJungfernheide = (s) =>
	   s.id === 3067
	&& s.ds100 === 'BJUF'
	&& s.name === 'Jungfernheide'
	&& s.agency === 'VBB'
	&& s.street === 'Max-Dohrn-Str.5'
	&& s.zip === 10589
	&& s.city === 'Berlin'
	&& s.state === 'BE'



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
