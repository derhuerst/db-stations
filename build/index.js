'use strict'

const details = require('./details')
const stations = require('./stations')



details.on('error', console.error)
.on('data', (details) => {

	stations.on('error', console.error)
	.on('data', (station) => {
		console.log('->', station)
	})

})
