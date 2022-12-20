// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module'
const require = createRequire(import.meta.url)

import {Readable} from 'node:stream'

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

const readStations = () => {
	return arrayAsReadable(stationsData)
}
const readFullStations = () => {
	return arrayAsReadable(fullData)
}

export {
	readStations,
	readFullStations,
}
