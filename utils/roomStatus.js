const RoomStatus = require('./../models/RoomStatus.model')

module.exports = {
	getCancelStatus: async (status) => {
		const obj = await RoomStatus.findOne({
			status: 'Cancelled',
		})
		return obj
	},
}
