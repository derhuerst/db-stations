'use strict'

const throttle = require('db-hafas/throttle')
const createEstimate = require('hafas-estimate-station-weight')

const weights = require('compute-db-station-weight/lib/weights')

const throttledHafas = throttle(5, 1000) // 5 reqs/s
const estimate = createEstimate(throttledHafas, weights)

module.exports = estimate
