const mongoose = require('mongoose')
const paymentSchema = require('./Payments.model').paymentSchema
const Schema = mongoose.Schema

const reservationSchema = new Schema(
	{
		tenantId: {
			type: mongoose.Types.ObjectId,
			ref: 'Tenant',
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
		payments: [paymentSchema],
	},
	{
		timestamps: true,
	}
)

const Reservation = mongoose.model('Reservation', reservationSchema)
module.exports = Reservation
