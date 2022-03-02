const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reservationSchema = new Schema(
	{
		tenantId: {
			type: mongoose.Types.ObjectId,
		},
		camperId: {
			type: mongoose.Types.ObjectId,
		},
		siteId: {
			type: mongoose.Types.ObjectId,
		},
		arrivalDate: {
			type: Date,
		},
		departureDate: {
			type: Date,
		},
		notes: {
			type: String,
		},
		createdBy: {
			type: String,
		},
		siteStatusLookupId: {
			type: Number,
		},
	},
	{
		timestamps: true,
	}
)

const Reservation = mongoose.model('Reservation', reservationSchema)
module.exports = Reservation
