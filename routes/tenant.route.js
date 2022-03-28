const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Tenant = require('./../models/Tenant.model')

router.post('/', async (req, res) => {
	const {
		isActive,
		name,
		address,
		city,
		state,
		zip,
		phoneNumber,
		businnessWebsite,
		latitude,
		longitude,
		images,
		sites,
		amenities,
		attractions,
	} = req.body
	try {
		const tenant = new Tenant({
			isActive,
			name,
			address,
			city,
			state,
			zip,
			phoneNumber,
			businnessWebsite,
			latitude,
			longitude,
			images,
			sites,
			amenities,
			attractions,
		})
		await tenant.save()
		res.sendStatus(200)
	} catch (err) {
		console.log(err)
	}
})

router.get('/get_tenant_by_id', async (req, res) => {
	const tenantId = req.query.tenant_id
	try {
		const tenant = await Tenant.findById({
			_id: mongoose.Types.ObjectId(tenantId),
		})
			.populate('reviews.camper')
			.populate('reviews.reservation')
		res.status(200).json({
			tenant: tenant,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

router.get('/', async (req, res) => {
	const lat = req.query.lat
	const lng = req.query.lng

	try {
		const tenants = await Tenant.find({
			isActive: true,
		})
		let filteredTenants = []
		for (let i = 0; i < tenants.length; i++) {
			if (distance(lat, tenants[i].latitude, lng, tenants[i].longitude) <= 25) {
				filteredTenants.push(tenants[i])
			}
		}
		res.status(200).json({
			tenants: filteredTenants,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

router.post('/review', async (req, res) => {
	const { tenantId, rating, comment, camperId, reservationId } = req.body

	try {
		await Tenant.findByIdAndUpdate(tenantId, {
			$push: {
				reviews: {
					rating: rating,
					comment: comment,
					camper: camperId,
					reservation: reservationId,
				},
			},
		})
		res.status(200).json({
			message: 'Review Added.',
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

// Helpers
const distance = (lat1, lat2, lon1, lon2) => {
	lon1 = (lon1 * Math.PI) / 180
	lon2 = (lon2 * Math.PI) / 180
	lat1 = (lat1 * Math.PI) / 180
	lat2 = (lat2 * Math.PI) / 180

	let dlon = lon2 - lon1
	let dlat = lat2 - lat1
	let a =
		Math.pow(Math.sin(dlat / 2), 2) +
		Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2)

	let c = 2 * Math.asin(Math.sqrt(a))
	let r = 3956

	return c * r
}

module.exports = router
