const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OTPSchema = new Schema(
	{
		OTP: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
)

const camperSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		zip: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		lastLogin: {
			type: Date,
		},
		adults: {
			type: Number,
		},
		children: {
			type: Number,
		},
		latestOTP: {
			type: OTPSchema,
		},
	},
	{
		timestamps: true,
	}
)

const Camper = mongoose.model('Camper', camperSchema)
module.exports = Camper
