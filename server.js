require('dotenv').config()
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { generateAccessToken } = require('./utils/auth.util')
const app = express()
const port = process.env.PORT || 5000

// Db Connection
mongoose
	.connect(process.env.DATABASE_URI)
	.then(() => {
		console.log('Mongoose connection established')
	})
	.catch((err) => {
		console.log(err)
	})

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use('/auth', require('./routes/auth.route'))
app.use('/tenant', require('./routes/tenant.route'))
app.use('/camper', require('./routes/camper.route'))
app.use('/site', require('./routes/site.route'))
app.use('/reservation', require('./routes/reservation.route'))

app.post('/token', async (req, res) => {
	const { refreshToken } = req.body
	if (refreshToken == null) return res.sendStatus(401)
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, camper) => {
		if (err) {
			return res.sendStatus(403)
		}
		const accessToken = generateAccessToken(camper)
		res.json({
			accessToken: accessToken,
		})
	})
})

app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})
