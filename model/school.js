const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
	name: { type: String, default: null, unique: false },
	email: { type: String, unique: true },
	inep: { type: Number, required: true },
	has_medium_teaching: { type: Boolean },
	accept_terms: { type: Boolean, required: true },
	users: {type: Array, select: false}
}, {
	timestamps: true
});

module.exports = mongoose.model("school", schoolSchema);