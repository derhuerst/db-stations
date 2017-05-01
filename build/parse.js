'use strict'

const coordinates = (data) => {
	return (
		data.evaNumbers
		&& data.evaNumbers[0]
		&& data.evaNumbers[0].geographicCoordinates
		&& data.evaNumbers[0].geographicCoordinates.coordinates
	) ? {
		latitude: data.evaNumbers[0].geographicCoordinates.coordinates[0],
		longitude: data.evaNumbers[0].geographicCoordinates.coordinates[1]
	} : null
}

const ds100 = (data) => {
	return (
		data.ril100Identifiers
		&& data.ril100Identifiers[0]
	) ? data.ril100Identifiers[0].rilIdentifier : null
}

module.exports = {coordinates, ds100}