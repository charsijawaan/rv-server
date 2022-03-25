const jwt = require('jsonwebtoken')

module.exports = {
	generateAccessToken: (camper) => {
		return jwt.sign(
			{ id: camper._id, timestamp: new Date().getTime() },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '10m' }
		)
	},
	authenticateToken: (req, res, next) => {
		const authHeader = req.headers['authorization']
		const token = authHeader && authHeader.split(' ')[1]
		if (token == null) return res.sendStatus(401)
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, camper) => {
			if (err) {
				return res.sendStatus(403)
			}
			req.camper = camper
			next()
		})
	},
	generateOTP: (len) => {
		var digits = '0123456789'
		let OTP = ''
		for (let i = 0; i < len; i++) {
			OTP += digits[Math.floor(Math.random() * 10)]
		}
		return OTP
	},
}
