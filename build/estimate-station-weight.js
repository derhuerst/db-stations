'use strict'

const throttle = require('db-hafas/throttle')
const createEstimate = require('hafas-estimate-station-weight')

const weights = require('compute-db-station-weight/lib/weights')

const throttledHafas = throttle(10, 1000) // 10 reqs/s
const estimate = createEstimate(throttledHafas, weights)

module.exports = estimate
