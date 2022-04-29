const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
	name: { type: String, default: null },
	email: { type: String, unique: true },
	users: { type: Array },
	classes: { type: Array },
});

module.exports = mongoose.model("school", schoolSchema);