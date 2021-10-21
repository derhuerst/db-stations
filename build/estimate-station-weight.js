'use strict'

const withThrottling = require('hafas-client/throttle')
const dbProfile = require('hafas-client/p/db')
const withRetrying = require('hafas-client/retry')
const createHafasClient = require('hafas-client')
const createEstimate = require('hafas-estimate-station-weight')

const weights = require('compute-db-station-weight/lib/weights')

const throttledDbProfile = withThrottling(dbProfile, 15, 1000) // 15 reqs/s
const retryingThrottledDbProfile = withRetrying(throttledDbProfile)
const hafas = createHafasClient(retryingThrottledDbProfile, 'db-stations build')

const estimate = createEstimate(hafas, weights)

module.exports = estimate
