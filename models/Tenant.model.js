const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tenantImage = new Schema(
	{
		image: {
			type: String,
		},
		isDefault: {
			type: Boolean,
		},
	},
	{
		timestamps: true,
		_id: false,
	}
)

const tenantSite = new Schema(
	{
		isActive: {
			type: Boolean,
		},
		rate: {
			type: String,
		},
		roomNumber: {
			type: String,
		},
		amps: {
			type: String,
		},
		type: {
			type: String,
		},
		sortOrder: {
			type: Number,
		},
	},
	{
		timestamps: true,
	}
)

const tenantAmenities = new Schema(
	{
		hasWifi: {
			type: Boolean,
		},
		hasRestrooms: {
			type: Boolean,
		},
		hasDogFacilities: {
			type: Boolean,
		},
		hasCableTV: {
			type: Boolean,
		},
		hasShowers: {
			type: Boolean,
		},
		hasGeneralStore: {
			type: Boolean,
		},
		hasLaundry: {
			type: Boolean,
		},
		hasGym: {
			type: Boolean,
		},
		hasPool: {
			type: Boolean,
		},
		hasTrashPickup: {
			type: Boolean,
		},
		hasHandicapFacilities: {
			type: Boolean,
		},
		hasBBQFacilities: {
			type: Boolean,
		},
	},
	{
		timestamps: true,
		_id: false,
	}
)

const tenantAttractions = new Schema(
	{
		hasBiking: {
			type: Boolean,
		},
		hasRestaurants: {
			type: Boolean,
		},
		hasFishing: {
			type: Boolean,
		},
		hasBeach: {
			type: Boolean,
		},
		hasShopping: {
			type: Boolean,
		},
		hasGolfing: {
			type: Boolean,
		},
		hasHiking: {
			type: Boolean,
		},
		hasProfessionalSports: {
			type: Boolean,
		},
		hasMuseums: {
			type: Boolean,
		},
		hasHunting: {
			type: Boolean,
		},
		hasWatersports: {
			type: Boolean,
		},
		hasParks: {
			type: Boolean,
		},
	},
	{
		timestamps: true,
		_id: false,
	}
)

const reviewSchema = new Schema(
	{
		rating: {
			type: Number,
		},
		comment: {
			type: String,
		},
		camper: {
			type: mongoose.Types.ObjectId,
			ref: 'Camper',
		},
		reservation: {
			type: mongoose.Types.ObjectId,
			ref: 'Reservation',
		},
	},
	{
		timestamps: true,
	}
)

const tenantSchema = new Schema(
	{
		isActive: {
			type: Boolean,
		},
		name: {
			type: String,
		},
		address: {
			type: String,
		},
		city: {
			type: String,
		},
		state: {
			type: String,
		},
		zip: {
			type: String,
		},
		phoneNumber: {
			type: String,
		},
		businnessWebsite: {
			type: String,
		},
		latitude: {
			type: String,
		},
		longitude: {
			type: String,
		},
		images: [
			{
				type: tenantImage,
			},
		],
		sites: [
			{
				type: tenantSite,
			},
		],
		amenities: [
			{
				type: tenantAmenities,
			},
		],
		attractions: [
			{
				type: tenantAttractions,
			},
		],
		referenceNumber: {
			type: String,
		},
		referredBy: {
			type: String,
		},
		stripeUserId: {
			type: String,
		},
		stripePlanId: {
			type: String,
		},
		stripeCustomerId: {
			type: String,
		},
		stripeSubscriptionId: {
			type: String,
		},
		applicationFee: {
			type: String,
		},
		applyAplicationFee: {
			type: Boolean,
		},
		businnessTypeLookupId: {
			type: Number,
		},
		planTypeLookupId: {
			type: Number,
		},
		reviews: [reviewSchema],
	},
	{
		timestamps: true,
	}
)

const Tenant = mongoose.model('Tenant', tenantSchema)
module.exports = Tenant
