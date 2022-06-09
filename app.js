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
const school = require("./model/school");

// Register
app.post("/school/register", auth, async (req, res) => {
	// our register logic goes here...
	try {
		// Get school input
		const { name, email, inep, has_medium_teaching, accept_terms } = req.body;
		if (!accept_terms) {
			return res.status(400).send({ message: 'Você deve aceitar os termos de uso para continuar.' })
		}
		if (!has_medium_teaching) {
			return res.status(400).send({ message: 'Atualmente somente ensino médio é suportado.' })
		}
		// Validate school input
		if (!(email && name && inep)) {
			return res.status(422).send({ message: 'Todos campos devem ser preenchidos!' });
		}

		// check if school already exist
		// Validate if school exist in our database
		const oldSchool = await School.findOne({ inep });

		if (oldSchool) {
			return res.status(422).send({ message: 'INEP já registrado. Por favor verifique se sua escola já não está cadastrada no sistema.' });
		}

		// Create school in our database
		const school = await School.create({
			name,
			email: email.toLowerCase(), // sanitize: convert email to lowercase
			inep,
			has_medium_teaching,
			accept_terms
		});

		// return new school
		// return res.status(201).json({message: 'Vai add'})
		return res.status(201).json({ message: 'Escola adicionada com sucesso!' });
	} catch (err) {
		console.log(err);
		return res.status(500).send({ message: 'Erro ao criar escola.' })
	}
});

// updates school
app.post("/school/:id", auth, async (req, res) => {
	const id = req.params.id

	const { name, email, users, classes } = req.body;

	try {
		school = await School.findOneAndUpdate({ id }, {
			name,
			email: email.toLowerCase(), // sanitize: convert email to lowercase
			users,
		});
		return res.status(204).send({ school })
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Erro ao editar escola" })
	}


});

// get all schools
app.get("/school/all", auth, async (req, res) => {
	// return res.status(200)
	const schools = await School.find()
	console.log(schools);
	if (schools) {
		return res.status(200).json(schools)
	} else {
		return res.status(404).send({ message: "Escola não encontrado" })
	}
});

app.get("/school/my", auth, async (req, res) => {
	try {
		const schools = await school.find({ users: { "$in": req.user.user_id } })
		if (schools){
			return res.status(200).json(schools)
		}
		else{
			return res.status(404).send({ message: "Nenhuma escola para seu usuário." })
		}
	} catch (error) {
		console.log('error', error);
		return res.status(500).send({ message: 'Erro ao procurar, entre em contato com o administrador.' })
	}
});

// get school
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

// delete school
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