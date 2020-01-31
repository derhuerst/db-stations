'use strict'

const createThrottledHafas = require('db-hafas/throttle')
const createEstimate = require('hafas-estimate-station-weight')

const weights = require('compute-db-station-weight/lib/weights')

const hafas = createThrottledHafas('db-stations build', 5, 1000) // 5 reqs/s
const estimate = createEstimate(hafas, weights)

module.exports = estimate
