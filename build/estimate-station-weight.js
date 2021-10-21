'use strict'

const createThrottledHafas = require('db-hafas/throttle')
const createEstimate = require('hafas-estimate-station-weight')

const weights = require('compute-db-station-weight/lib/weights')

const hafas = createThrottledHafas('db-stations build', 15, 1000) // 15 reqs/s
const estimate = createEstimate(hafas, weights)

module.exports = estimate
