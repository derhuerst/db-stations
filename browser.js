'use strict'

const fromArr = require('from2-array')

const stationsData = require('./data.json')
const fullData = require('./full.json')

const stations = () => fromArr.obj(stationsData)
const full = () => fromArr.obj(fullData)
stations.full = full

module.exports = stations
