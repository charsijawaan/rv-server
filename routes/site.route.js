const express = require('express')
const router = express.Router()
const Reservation = require('./../models/Reservation.model')
const Tenant = require('./../models/Tenant.model')
const moment = require('moment')

router.get('/get_available_sites', async (req, res) => {
	try {
		const { arrival_date, departure_date, tenant_id } = req.query

		// Reserved Sites
		const reservedSites = await Reservation.find({
			tenantId: tenant_id,
			$or: [
				{
					arrivalDate: {
						$gte: moment(arrival_date).toDate(),
					},
					departureDate: {
						$lte: moment(departure_date).toDate(),
					},
				},
				{
					arrivalDate: {
						$lte: moment(departure_date).toDate(),
					},
					departureDate: {
						$gte: moment(arrival_date).toDate(),
					},
				},
			],
		}).select('siteId')
		const reservedSitesIds = reservedSites.map((site) => site.siteId.toString())

		// All Sites of the Tenant
		let allSites = await Tenant.find({
			_id: tenant_id,
		}).select('sites')
		allSites = allSites[0].sites

		// Sites that are available
		const availableSites = allSites.filter((site) => {
			return !reservedSitesIds.includes(site._id.toString())
		})

		res.status(200).json({
			message: 'Reserved Sites',
			availableSites: availableSites,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

module.exports = router
