const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomStatusSchema = new Schema({
	id: {
		type: Number,
	},
	status: {
		type: String,
	},
	isValidArrivalStatus: {
		type: Boolean,
	},
	isValidDepartureStatus: {
		type: Boolean,
	},
	allowSiteChange: {
		type: Boolean,
	},
	allowEarlyDeparture: {
		type: Boolean,
	},
})

const RoomStatus = mongoose.model('RoomStatusLookupIds', roomStatusSchema)
module.exports = RoomStatus
