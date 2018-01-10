'use strict'

const location = (data) => {
	if (
		data.evaNumbers &&
		data.evaNumbers[0] &&
		data.evaNumbers[0].geographicCoordinates &&
		data.evaNumbers[0].geographicCoordinates.coordinates
	) {
		return {
			type: 'location',
			latitude: data.evaNumbers[0].geographicCoordinates.coordinates[1],
			longitude: data.evaNumbers[0].geographicCoordinates.coordinates[0]
		}
	}
	return null
}

const id = (data) => {
	const eva = data.evaNumbers.find((eva) => eva.isMain)
	if (eva) return eva.number + ''
	if (data.evaNumbers[0]) return data.evaNumbers[0].number + ''
	return null
}

const ds100 = (data) => {
	return (
		data.ril100Identifiers
		&& data.ril100Identifiers[0]
	) ? data.ril100Identifiers[0].rilIdentifier : null
}

module.exports = {location, id, ds100}