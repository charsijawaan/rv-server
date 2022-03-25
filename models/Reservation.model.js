const mongoose = require('mongoose')
const paymentSchema = require('./Payments.model').paymentSchema
const Schema = mongoose.Schema

const reviewSchema = new Schema(
	{
		rating: {
			type: Number,
		},
		comment: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
)

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
		reviews: [reviewSchema],
	},
	{
		timestamps: true,
	}
)

const Reservation = mongoose.model('Reservation', reservationSchema)
module.exports = Reservation
