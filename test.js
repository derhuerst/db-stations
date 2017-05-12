'use strict'

const test = require('tape')
const isStream = require('is-stream')
const isRoughlyEqual = require('is-roughly-equal')

const stations = require('.')



const assertIsValidStation = (t, s) => {
	t.equal(s.type, 'station')
	t.equal(typeof s.id, 'string')
	t.ok(s.id)

	if (s.nr !== null) t.equal(typeof s.nr, 'number')
	if (s.ds100 !== null) {
		t.equal(typeof s.ds100, 'string')
		t.ok(s.ds100)
	}

	t.equal(typeof s.name, 'string')
	t.ok(s.name)

	t.ok(s.address)
	if (s.address.street) t.equal(typeof s.address.street, 'string')
	t.equal(typeof s.address.zipcode, 'string')
	t.ok(s.address.zipcode)
	t.equal(typeof s.address.city, 'string')
	t.ok(s.address.city)

	if (s.coordinates !== null) {
		t.equal(typeof s.coordinates.latitude, 'number')
		t.ok(isRoughlyEqual(5, s.coordinates.latitude, 51))
		t.equal(typeof s.coordinates.longitude, 'number')
		t.ok(isRoughlyEqual(5, s.coordinates.longitude, 10))
	}
}

const assertIsJungfernheide = (t, s) => {
	t.equal(s.id, '8089100')
	t.equal(s.nr, 3067)
	t.equal(s.ds100, 'BJUF')
	t.equal(s.name, 'Jungfernheide')

	t.equal(s.address.zipcode, '10589')
	t.equal(s.address.city, 'Berlin')

	t.ok(isRoughlyEqual(.0001, s.coordinates.latitude, 52.530276))
	t.ok(isRoughlyEqual(.0001, s.coordinates.longitude, 13.299437))
}



test('data.ndjson contains valid simplified stations', (t) => {
	stations()
	.on('error', t.ifError)
	.on('data', (s) => {
		assertIsValidStation(t, s)
	})
	.on('end', () => {
		t.end()
	})
})

test('data.ndjson contains Berlin Jungfernheide', (t) => {
	stations()
	.on('error', t.ifError)
	.on('data', (s) => {
		if (s.id === '8089100') {
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

		t.ok(s.operator)
		t.equal(s.operator.type, 'operator')
		t.equal(typeof s.operator.id, 'string')
		t.ok(s.operator.id)
		t.equal(typeof s.operator.name, 'string')
		t.ok(s.operator.name)

		if (s.category) t.equal(typeof s.category, 'number')
		if (s.federalState) t.equal(typeof s.federalState, 'string')

		// todo
		// t.equal(typeof s.hasParking, 'boolean')
		// t.equal(typeof s.hasBicycleParking, 'boolean')
		// t.equal(typeof s.hasLocalPublicTransport, 'boolean')
		// t.equal(typeof s.hasPublicFacilities, 'boolean')
		// t.equal(typeof s.hasLockerSystem, 'boolean')
		// t.equal(typeof s.hasTaxiRank, 'boolean')
	})
	.on('end', () => {
		t.end()
	})
})

test('full.ndjson contains Berlin Jungfernheide', (t) => {
	stations.full()
	.on('error', t.ifError)
	.on('data', (s) => {
		if (s.id === '8089100') {
			assertIsJungfernheide(t, s)
			t.end()
		}
	})
})
