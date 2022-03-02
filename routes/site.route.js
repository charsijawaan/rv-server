const express = require('express')
const router = express.Router()

router.get('/get_available_sites', async (req, res) => {
	try {
		const { arrival_date, departure_date, tenant_id } = req.query

		console.log(arrival_date)
		console.log(departure_date)
		console.log(tenant_id)

		res.sendStatus(200)
	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
})

module.exports = router
