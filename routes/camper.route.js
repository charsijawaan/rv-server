const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Tenant = require('./../models/Tenant.model')
const CreditCard = require('./../models/CreditCard.model')
const Payment = require('./../models/Payments.model')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

router.post('/add_new_card', async (req, res) => {
	const {
		creditCardType,
		creditCardLastFour,
		creditCardExpirationMonth,
		creditCardExpirationYear,
		token,
		camperId,
		createdBy,
		isActive,
	} = req.body
	try {
		const customer = await stripe.customers.create({
			source: token,
			email: createdBy,
		})

		const creditCard = new CreditCard({
			creditCardType,
			creditCardLastFour,
			creditCardExpirationMonth,
			creditCardExpirationYear,
			stripeCustomerId: customer.id,
			camperId,
			createdBy,
			isActive,
		})

		await creditCard.save()

		res.status(200).json({
			message: 'New Credit Card Added.',
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

router.get('/get_cards', async (req, res) => {
	const { camperId } = req.query
	try {
		const creditCards = await CreditCard.find({
			camperId: camperId,
		})
		res.status(200).json({
			creditCards,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

router.post('/reserve', async (req, res) => {
	const { camperId, siteId, camperCreditCard, createdBy } = req.body
	const tenantAccount = 'acct_1KUFrCR4VvHbKTWm'

	const site = await Tenant.findOne({}).select({
		sites: {
			$elemMatch: {
				_id: mongoose.Types.ObjectId(siteId),
			},
		},
	})

	try {
		const token = await stripe.tokens.create(
			{
				customer: camperCreditCard.stripeCustomerId,
			},
			{
				stripeAccount: tenantAccount,
			}
		)

		const customer = await stripe.customers.create(
			{
				source: token.id,
			},
			{
				stripeAccount: tenantAccount,
			}
		)

		const amount = Number(site.sites[0].rate) * 100
		const paymentIntent = await stripe.paymentIntents.create(
			{
				amount: amount,
				currency: 'usd',
				payment_method_types: ['card'],
				payment_method: customer.default_source,
				customer: customer.id,
				confirm: true,
				application_fee_amount: amount * 0.01,
			},
			{
				stripeAccount: tenantAccount,
			}
		)

		const payment = new Payment({
			details: paymentIntent,
		})
		await payment.save()

		//

		res.status(200).json({
			message: 'Reservation Successful',
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

router.post('/credit_card', async (req, res) => {
	const { cardId } = req.body
	try {
		await CreditCard.findByIdAndDelete(cardId)
		res.status(200).json({
			message: 'Card Deleted.',
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

module.exports = router
