import {withThrottling} from 'hafas-client/throttle.js'
import {profile as dbProfile} from 'hafas-client/p/db/index.js'
import {withRetrying} from 'hafas-client/retry.js'
import {createClient as createHafasClient} from 'hafas-client'
import {createEstimate} from 'hafas-estimate-station-weight'

import weights from 'compute-db-station-weight/lib/weights.js'

const throttledDbProfile = withThrottling(dbProfile, 15, 1000) // 15 reqs/s
const retryingThrottledDbProfile = withRetrying(throttledDbProfile)
const hafas = createHafasClient(retryingThrottledDbProfile, 'db-stations build')

const estimateStationWeight = createEstimate(hafas, weights)

export {
	estimateStationWeight,
}
