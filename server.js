require('dotenv').config()
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
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

app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})
