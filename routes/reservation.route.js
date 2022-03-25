const express = require('express')
const router = express.Router()
const Reservation = require('./../models/Reservation.model')

router.post('/review', async (req, res) => {
	const { reservationId, rating, comment } = req.body

	try {
		await Reservation.findByIdAndUpdate(reservationId, {
			$push: {
				reviews: {
					rating: rating,
					comment: comment,
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

module.exports = router
