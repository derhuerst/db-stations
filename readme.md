# db-stations

A **collection of all stations of [Deutsche Bahn](http://db.de/)**, computed from [open data](https://developer.deutschebahn.com/store/apis/info?name=StaDa-Station_Data&version=v2&provider=DBOpenData).

*Warning*: This module does not contain stations without an [IBNR](https://de.wikipedia.org/wiki/Internationale_Bahnhofsnummer).

[![npm version](https://img.shields.io/npm/v/db-stations.svg)](https://www.npmjs.com/package/db-stations)
[![build status](https://img.shields.io/codeship/a827d230-e420-0135-2d6a-3e0434e5c2c3/master.svg)](https://app.codeship.com/projects/268749)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/db-stations.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installing

```shell
npm install db-stations
```

*Note:* This Git repo does not contain the data, but the npm package does.


## Usage

`stations()` returns a [readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) in [object mode](https://nodejs.org/api/stream.html#stream_object_mode), emitting [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format) `station` objects.

```js
const stations = require('db-stations')

stations()
.on('data', console.log)
.on('error', console.error)
```

```js
{
	type: 'station',
	id: '8000007', // EVA number
	ds100: 'FALZ', // DS100 code
	nr: 133, // DB internal
	name: 'Alzey',
	weight: 73.1,
	location: {
		type: 'location',
		latitude: 49.7502,
		longitude: 8.109749
	},
	operator: {
		type: 'operator',
		id: 'zweckverband-schienenpersonennahverkehr-rheinland-pfalz-sud',
		name: 'ZPNV Süd'
	},
	address: {
		city: 'Alzey',
		zipcode: '55232',
		street: 'Bahnhofstr. 30'
	}
}
// and a lot more…
```

---

`stations.full()` returns a [readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) in [object mode](https://nodejs.org/api/stream.html#stream_object_mode), emitting [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format) `station` objects with more information.

```js
stations.full()
.on('data', console.log)
.on('error', console.error)
```

```js
{
	type: 'station',
	id: '8000007',
	additionalIds: [],
	ds100: 'FALZ',
	nr: 133,
	name: 'Alzey',
	weight: 73.1,
	location: {
		type: 'location',
		latitude: 49.7502,
		longitude: 8.109749
	},
	operator: {
		type: 'operator',
		id: 'zweckverband-schienenpersonennahverkehr-rheinland-pfalz-sud',
		name: 'ZPNV Süd'
	},
	address: {
		city: 'Alzey',
		zipcode: '55232',
		street: 'Bahnhofstr. 30'
	},
	category: 3,
	priceCategory: 3,
	hasParking: true,
	hasBicycleParking: true,
	hasLocalPublicTransport: true,
	hasPublicFacilities: false,
	hasLockerSystem: false,
	hasTaxiRank: true,
	hasTravelNecessities: false,
	hasSteplessAccess: 'partial',
	hasMobilityService: 'no',
	hasWiFi: false,
	hasTravelCenter: false,
	hasRailwayMission: false,
	hasDBLounge: false,
	hasLostAndFound: false,
	hasCarRental: false,
	federalState: 'Rheinland-Pfalz',
	regionalbereich: {
		number: 5,
		name: 'RB Mitte',
		shortName: 'RB M'
	},
	timeTableOffice: {
		email: 'DBS.Fahrplan.RhldPfalzSaarland@deutschebahn.com',
		name: 'Bahnhofsmanagement Mainz'
	},
	szentrale: {
		number: 24,
		publicPhoneNumber: '06131/151055',
		name: 'Mainz Hbf'
	},
	stationManagement: {
		number: 184,
		name: 'Mainz'
	},
	ril100Identifiers: [ {
		rilIdentifier: 'FALZ',
		isMain: true,
		hasSteamPermission: true,
		geographicCoordinates: {
			type: 'Point',
			coordinates: [
				8.109684725,
				49.750267695
			]
		}
	} ]
}
```


## Related

- [`db-stations-autocomplete`](https://github.com/derhuerst/db-stations-autocomplete#db-stations-autocomplete) – Search for stations of DB (data from DB station API).
- [`db-hafas-stations`](https://github.com/derhuerst/db-hafas-stations#db-hafas-stations) – A list of DB stations, taken from HAFAS.
- [`db-hafas-stations-autocomplete`](https://github.com/derhuerst/db-hafas-stations-autocomplete#db-stations-autocomplete) – Search for stations of DB (data from HAFAS).


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/db-stations/issues).


## Data License

The generated data in [`data.ndjson`](data.ndjson) has originally [been](http://data.deutschebahn.com/dataset/data-stationsdaten) [published](http://data.deutschebahn.com/dataset/data-haltestellen) under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) by *Deutsche Bahn (DB)*.
