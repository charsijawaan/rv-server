const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Tenant = require('./../models/Tenant.model')
const CreditCard = require('./../models/CreditCard.model')
const Payment = require('./../models/Payments.model').Payment
const Reservation = require('./../models/Reservation.model')
const { getCancelStatus } = require('./../utils/roomStatus')
const Camper = require('../models/Camper.model')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { authenticateToken } = require('./../utils/auth.util')

router.post('/add_new_card', authenticateToken, async (req, res) => {
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

router.get('/get_cards', authenticateToken, async (req, res) => {
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

router.get('/get_trips', authenticateToken, async (req, res) => {
	const { camperId } = req.query

	try {
		const cancel = await getCancelStatus()
		const reservations = await Reservation.find({
			camperId: mongoose.Types.ObjectId(camperId),
			siteStatusLookupId: {
				$nin: [cancel.id],
			},
		}).populate('tenantId')

		res.status(200).json({
			reservations,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

router.post('/cancel_reservation', authenticateToken, async (req, res) => {
	const { reservationId } = req.body
	try {
		const cancel = await getCancelStatus()
		await Reservation.findByIdAndUpdate(reservationId, {
			siteStatusLookupId: cancel.id,
		})
		res.status(200).json({
			message: 'Reservation Cancelled.',
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

router.post('/reserve', authenticateToken, async (req, res) => {
	const { camperId, tenantId, siteId, startDate, endDate, camperCreditCard, notes, createdBy } =
		req.body

	const tenantAccount = 'acct_1KUFrCR4VvHbKTWm'
	let site = await Tenant.findOne({
		_id: mongoose.Types.ObjectId(tenantId),
	}).select({
		sites: {
			$elemMatch: {
				_id: mongoose.Types.ObjectId(siteId),
			},
		},
	})
	site = site.sites[0]

	try {
		// Cut Payment First
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

		const amount = Number(site.rate) * 100
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

		// Reserve Site After Payment is Done
		const reservation = new Reservation({
			tenantId,
			camperId,
			siteId,
			arrivalDate: startDate,
			departureDate: endDate,
			notes,
			createdBy,
			siteStatusLookupId: 2,
			payments: payment,
		})
		await reservation.save()

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

router.post('/update_adults', authenticateToken, async (req, res) => {
	const { camperId, adults } = req.body
	try {
		await Camper.findByIdAndUpdate(camperId, {
			adults: adults,
		})
		res.status(200).json({
			message: 'Adults updated.',
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

router.post('/update_children', authenticateToken, async (req, res) => {
	const { camperId, children } = req.body
	try {
		await Camper.findByIdAndUpdate(camperId, {
			children: children,
		})
		res.status(200).json({
			message: 'Children updated.',
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

module.exports = router
