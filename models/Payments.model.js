const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paymentSchema = new Schema(
	{
		details: {
			type: Object,
		},
	},
	{
		timestamps: true,
	}
)

const Payment = mongoose.model('Payment', paymentSchema)
module.exports = Payment
