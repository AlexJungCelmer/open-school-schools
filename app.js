require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

const app = express();

app.use(express.json());

// Logic goes here
// importing user context
const School = require("./model/school");

// Register
app.post("/school/register", auth, async (req, res) => {
	// our register logic goes here...
	try {
		// Get school input
		const { name, email, users } = req.body;

		// Validate school input
		if (!(email && name)) {
			res.status(400).send({ message: 'Todos campos devem ser preenchidos!' });
		}

		// check if school already exist
		// Validate if school exist in our database
		const oldUser = await School.findOne({ email });

		if (oldUser) {
			return res.status(409).send({ message: 'Usuário já registrado. Por favor faça login.' });
		}

		// Create school in our database
		const school = await School.create({
			name,
			email: email.toLowerCase(), // sanitize: convert email to lowercase
			users,
		});

		// return new school
		return res.status(201).json(school);
	} catch (err) {
		console.log(err);
		return res.status(500).send({ message: 'Erro ao criar escola.' })
	}
});

app.post("/school/:id", auth, async (req, res) => {
	const id = req.params.id

	const { name, email, users, classes } = req.body;

	try {
		school = await School.findOneAndUpdate({ id }, {
			name,
			email: email.toLowerCase(), // sanitize: convert email to lowercase
			users,
			classes
		});
		return res.status(204).json(school)
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Erro ao editar escola" })
	}


});

app.get("/schools/", auth, async (req, res) => {
	const schools = await School.find()
	if (schools) {
		return res.status(200).json(schools)
	} else {
		return res.status(404).send({ message: "Escola não encontrado" })
	}
});

app.get("/school/:id", auth, async (req, res) => {
	try {
		const { id } = req.params
		const school = await School.findById(id)
		if (school) {
			return res.status(200).send(school)
		} else {
			return res.status(404).send({ message: 'Nenhuma escola removido!' })
		}
	} catch (error) {
		return res.status(500).send({ message: 'Erro no servidor!' })
	}
})

app.delete("/school/:id", auth, async (req, res) => {
	try {
		const { id } = req.params
		const user = await School.findByIdAndDelete(id)
		if (user) {
			return res.status(200).send({ message: 'Escola removido com sucesso!' })
		} else {
			return res.status(404).send({ message: 'Nenhuma escola removido!' })
		}
	} catch (error) {
		return res.status(500).send({ message: 'Erro no servidor!' })
	}
})

module.exports = app;