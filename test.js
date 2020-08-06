'use strict'

const test = require('tape')
const isStream = require('is-stream')
const isRoughlyEqual = require('is-roughly-equal')

const {ril100: parseRil100} = require('./build/parse')
const stations = require('.')
const createFilter = require('./create-filter')



const assertIsValidStation = (t, s, row) => {
	t.equal(s.type, 'station', `row ${row}: s.type`)
	t.equal(typeof s.id, 'string', `row ${row}: s.id`)
	t.ok(s.id, `row ${row}: s.id`)

	if (s.nr !== null) t.equal(typeof s.nr, 'number', `row ${row}: s.nr`)
	if (s.ril100 !== null) {
		t.equal(typeof s.ril100, 'string', `row ${row}: s.ril100`)
		t.ok(s.ril100, `row ${row}: s.ril100`)
	}

	t.equal(typeof s.name, 'string', `row ${row}: s.name`)
	t.ok(s.name, `row ${row}: s.name`)

	if (s.weight !== undefined && s.weight !== null) {
		t.equal(typeof s.weight, 'number', `row ${row}: s.weight`)
		t.ok(s.weight > 0, `row ${row}: s.weight`)
	}

	if (s.address) {
		if (s.address.street) {
			t.equal(typeof s.address.street, 'string', `row ${row}: s.address.street`)
			t.ok(s.address.street, `row ${row}: s.address.street`)
		}
		if (s.address.zipcode) {
			t.equal(typeof s.address.zipcode, 'string', `row ${row}: s.address.zipcode`)
			t.ok(s.address.zipcode, `row ${row}: s.address.zipcode`)
		}
		if (s.address.city) {
			t.equal(typeof s.address.city, 'string', `row ${row}: s.address.city`)
			t.ok(s.address.city, `row ${row}: s.address.city`)
		}
	}

	if (s.location !== null) {
		t.equal(s.location.type, 'location', `row ${row}: s.location.type`)
		t.equal(typeof s.location.latitude, 'number', `row ${row}: s.location.latitude`)
		t.ok(isRoughlyEqual(5, s.location.latitude, 51), `row ${row}: s.location.latitude`)
		t.equal(typeof s.location.longitude, 'number', `row ${row}: s.location.longitude`)
		t.ok(isRoughlyEqual(5, s.location.longitude, 10), `row ${row}: s.location.longitude`)
	}
}

const assertIsJungfernheide = (t, s) => {
	t.ok(s.id === '8089100' || s.id === '8011167', 'id is 8089100 or 8011167')
	t.equal(s.nr, 3067)
	t.ok(s.ril100 === 'BJUF' || s.ril100 === 'BJUN') // WAT
	t.equal(s.name, 'Jungfernheide')

	t.equal(s.address.zipcode, '10589')
	t.equal(s.address.city, 'Berlin')

	t.ok(isRoughlyEqual(.0001, s.location.latitude, 52.530276))
	t.ok(isRoughlyEqual(.0001, s.location.longitude, 13.299437))
}



test('parseRil100 works', (t) => {
	const adelschlag = {
		number: 12,
		name: 'Adelschlag',
		evaNumbers: [{
			isMain: true,
			number: 8000419,
			geographicCoordinates: {latitude: 1.23, longitude: 2.34},
		}],
		ril100Identifiers: [{
			isMain: true,
			rilIdentifier: 'MAD',
			hasSteamPermission: true,
			geographicCoordinates: {latitude: 2.34, longitude: 1.23},
		}],
	}

	t.equal(parseRil100(adelschlag), 'MAD')
	t.end()
})

test('data.ndjson contains valid simplified stations', (t) => {
	let row = 0
	stations()
	.on('error', t.ifError)
	.on('data', (s) => {
		assertIsValidStation(t, s, ++row)
	})
	.on('end', () => {
		t.end()
	})
})

test('data.ndjson contains Berlin Jungfernheide', (t) => {
	stations()
	.on('error', t.ifError)
	.on('data', (s) => {
		if (s.id === '8089100' || s.id === '8011167') {
			assertIsJungfernheide(t, s)
			t.end()
		}
	})
})

test('full.ndjson contains valid full stations', (t) => {
	stations.full()
	.on('error', t.ifError)
	.on('data', (s) => {
		assertIsValidStation(t, s)

		t.ok(Array.isArray(s.additionalIds))
		t.notOk(s.additionalIds.includes(s.operator.id))

		t.ok(s.operator)
		t.equal(s.operator.type, 'operator')
		t.equal(typeof s.operator.id, 'string')
		t.ok(s.operator.id)
		t.equal(typeof s.operator.name, 'string')
		t.ok(s.operator.name)

		if (s.category) t.equal(typeof s.category, 'number')
		if (s.federalState) t.equal(typeof s.federalState, 'string')

		if ('hasParking' in s) t.equal(typeof s.hasParking, 'boolean')
		if ('hasBicycleParking' in s) t.equal(typeof s.hasBicycleParking, 'boolean')
		if ('hasLocalPublicTransport' in s) t.equal(typeof s.hasLocalPublicTransport, 'boolean')
		if ('hasPublicFacilities' in s) t.equal(typeof s.hasPublicFacilities, 'boolean')
		if ('hasLockerSystem' in s) t.equal(typeof s.hasLockerSystem, 'boolean')
		if ('hasTaxiRank' in s) t.equal(typeof s.hasTaxiRank, 'boolean')
	})
	.on('end', () => {
		t.end()
	})
})

test('full.ndjson contains Berlin Jungfernheide', (t) => {
	stations.full()
	.on('error', t.ifError)
	.on('data', (s) => {
		if (s.id === '8089100' || s.id === '8011167') {
			assertIsJungfernheide(t, s)
			t.end()
		}
	})
})

test('createFilter works properly', (t) => {
	const s = {
		type: 'station',
		id: 'foo',
		name: 'Foo',
		location: {latitude: 1.23, longitude: 2.34}
	}

	t.equal(createFilter({id: 'foo'})(s), true)
	t.equal(createFilter({id: 'FOO'})(s), false)

	t.equal(createFilter({latitude: 1.24})(s), false)
	t.equal(createFilter({latitude: 1.24})(s), false)

	t.end()
})
