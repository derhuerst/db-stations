const {Readable} = require('stream')

const stationsData = require('./data.json')
const fullData = require('./full.json')

const arrayAsReadable = (arr) => {
	const l = arr.length
	let i = 0
	return new Readable({
		objectMode: true,
		read: function (size) {
			const maxI = Math.min(i + size, l - 1)
			for (; i <= maxI; i++) {
				this.push(arr[i])
			}
			if (i === (l - 1)) this.push(null) // end
		},
	})
}

const stations = () => {
	return arrayAsReadable(stationsData)
}
const full = () => {
	return arrayAsReadable(fullData)
}
stations.full = full

module.exports = stations
