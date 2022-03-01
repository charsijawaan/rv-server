const mongoose = require('mongoose')
const Schema = mongoose.Schema

const creditCardSchema = new Schema({
	creditCardType: {
		type: String,
	},
	creditCardLastFour: {
		type: Number,
	},
	creditCardExpirationMonth: {
		type: Number,
	},
	creditCardExpirationYear: {
		type: Number,
	},
	stripeCustomerId: {
		type: String,
	},
	camperId: {
		type: mongoose.Types.ObjectId,
	},
	createdBy: {
		type: String,
	},
	isActive: {
		type: Boolean,
	},
})

const CreditCard = mongoose.model('CreditCard', creditCardSchema)
module.exports = CreditCard
