const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Camper = require('./../models/Camper.model')
const { generateOTP } = require('./../utils/auth.util')
const nodemailer = require('nodemailer')
const { generateAccessToken } = require('./../utils/auth.util')

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
				adults: 0,
				children: 0,
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
				const accessToken = generateAccessToken(camper.toJSON())
				const refreshToken = jwt.sign(camper.toJSON(), process.env.REFRESH_TOKEN_SECRET)
				res.status(200).json({
					message: 'Login successful.',
					camper: camper,
					accessToken: accessToken,
					refreshToken: refreshToken,
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

router.post('/generate_otp', async (req, res) => {
	const { email } = req.body
	const OTP = generateOTP(6)

	try {
		const transporter = nodemailer.createTransport({
			host: 'smtp-mail.outlook.com',
			port: 587,
			secure: false,
			// service: 'gmail',
			auth: {
				user: process.env.SUPPORT_EMAIL,
				pass: process.env.SUPPORT_PASS,
			},
		})
		const mailOptions = {
			from: process.env.SUPPORT_EMAIL,
			to: email,
			subject: 'OTP For Reset Password Request',
			text: `Your OTP is ${OTP}`,
		}

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error)
			}
		})

		await Camper.findOneAndUpdate(
			{
				email: email,
			},
			{
				latestOTP: {
					OTP: OTP,
				},
			}
		)
		res.status(200).json({
			message: 'OTP generated.',
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

router.post('/verify_otp', async (req, res) => {
	const { email, OTP, password, confirmPassword } = req.body

	try {
		const camper = await Camper.findOne({
			email: email,
		})

		if (OTP === camper?.latestOTP?.OTP) {
			if (password !== confirmPassword)
				res.status(401).json({
					message: 'Password and confirm password do not match.',
				})
			else {
				await Camper.findOneAndUpdate(
					{
						email: email,
					},
					{
						$unset: {
							latestOTP: 1,
						},
					}
				)

				const salt = bcrypt.genSaltSync(10)
				const passHash = bcrypt.hashSync(password, salt)

				await Camper.findOneAndUpdate(
					{
						email: email,
					},
					{
						password: passHash,
					}
				)

				res.status(200).json({
					message: 'Password Reset. Now you can login.',
				})
			}
		} else {
			res.status(401).json({
				message: 'OTP not verified.',
			})
		}
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Server error.',
		})
	}
})

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
