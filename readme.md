# db-stations 🚏

A **collection of all stations of [Deutsche Bahn](http://db.de/)**, computed from [open data](http://data.deutschebahn.com/dataset/data-stationsdaten).

[![npm version](https://img.shields.io/npm/v/db-stations.svg)](https://www.npmjs.com/package/db-stations)
[![build status](https://img.shields.io/travis/derhuerst/db-stations.svg)](https://travis-ci.org/derhuerst/db-stations)
[![dependency status](https://img.shields.io/david/derhuerst/db-stations.svg)](https://david-dm.org/derhuerst/db-stations)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/db-stations.svg)](https://david-dm.org/derhuerst/db-stations#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/db-stations.svg)


## Installing

```shell
npm install db-stations
```


## Usage

`stations()` returns a [readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) in [object mode](https://nodejs.org/api/stream.html#stream_object_mode).

```js
const stations = require('db-stations')

stations()
.on('data', console.log)
.on('error', console.error)
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/db-stations/issues).


## Data License

The generated data in [`data.ndjson`](data.ndjson) [has originally been published](http://data.deutschebahn.com/dataset/data-stationsdaten) under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) by *Deutsche Bahn (DB)*.
