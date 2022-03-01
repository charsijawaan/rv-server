const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Camper = require('./../models/Camper.model')

router.post('/register_camper', async (req, res) => {
	const { firstName, lastName, email, address, city, state, zip, phoneNumber, password } =
		req.body
	try {
		const camperExists = await isUniqueCamper(email, phoneNumber)
		if (camperExists) {
			const salt = bcrypt.genSaltSync(10)
			const passHash = bcrypt.hashSync(password, salt)

			const camper = new Camper({
				firstName,
				lastName,
				email,
				address,
				city,
				state,
				zip,
				phoneNumber,
				password: passHash,
			})
			await camper.save()
			res.status(200).json({
				message: 'Camper created. You can now login.',
			})
		} else {
			res.status(409).json({
				message: 'Camper already exists.',
			})
		}
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

router.post('/login_camper', async (req, res) => {
	const { email, password } = req.body
	try {
		const camper = await getCamperByEmail(email)
		if (camper) {
			if (!bcrypt.compareSync(password, camper.password)) {
				res.status(401).json({
					message: 'Invalid login credentials.',
				})
			} else {
				camper.password = undefined
				const accessToken = jwt.sign(camper.toJSON(), process.env.ACCESS_TOKEN_SECRET)
				res.status(200).json({
					message: 'Login successful.',
					camper: camper,
					accessToken: accessToken,
				})
			}
		} else {
			res.status(401).json({
				message: 'No Account with the Email was Found',
			})
		}
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	if (token == null) return res.sendStatus(401)
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, camper) => {
		if (err) return res.sendStatus(403)
		req.camper = camper
		next()
	})
}

// Helpers
const isUniqueCamper = async (email, phoneNumber) => {
	const camper = await Camper.findOne({
		email: email,
		phoneNumber: phoneNumber,
	})
	if (!camper) return true
	return false
}

const getCamperByEmail = async (email, password) => {
	return await Camper.findOne({
		email: email,
	})
}

module.exports = router