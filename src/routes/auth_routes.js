const User = require("../models/user");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const route = express.Router();

route.post("/cadastro", async (req, res) => {
	const { nome, email, telefone, senha } = req.body;
	const userExists = await User.findOne({ email: email });

	if (!nome) {
		return res.status(422).json({ msg: "O campo nome é necessário" });
	}
	if (!email) {
		return res.status(422).json({ msg: "O campo email é necessário" });
	}
	if (!senha) {
		return res.status(422).json({ msg: "O campo senha é necessário" });
	}
	if (!telefone) {
		return res.status(422).json({ msg: "O campo telefone é necessário" });
	}
	if (userExists) {
		return res.status(422).json({ msg: "Email já cadastrado" });
	}

	try {
		const salt = await bcrypt.genSalt(12);
		const passwordHash = await bcrypt.hash(senha, salt);

		const user = new User({ nome, email, telefone, senha: passwordHash });

		await user.save();

		const secret = process.env.SECRET;
		const token = jwt.sign({ id: user._id }, secret, { expiresIn: "30m" });

		res.status(200).json({
			success: true,
			id: user._id,
			dataCriacao: user.dataCriacao,
			dataUltimoLogin: user.dataUltimoLogin,
			dataAtualizacao: user.dataAtualizacao,
			token,
		});

	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Erro no servidor" });
	}
});

route.post("/login", async (req, res) => {
	const { email, senha } = req.body;
	const user = await User.findOne({ email: email });

	if (!email) {
		return res.status(422).json({ msg: "O campo email é necessário" });
	}
	if (!senha) {
		return res.status(422).json({ msg: "O campo senha é necessário" });
	}
	if (!user) {
		return res.status(404).json({ msg: "User not found" });
	}

	const check = await bcrypt.compare(senha, user.senha);

	if (!check) {
		return res.status(422).json({ msg: "Senha invalida" });
	}

	try {
		const secret = process.env.SECRET;

		const token = jwt.sign({ id: user._id }, secret, { expiresIn: "30m" });

		user.dataUltimoLogin = Date.now();
		user.dataAtualizacao = Date.now();

		await user.save();

		res.status(200).json({
			success: true,
			id: user._id,
			dataCriacao: user.dataCriacao,
			dataUltimoLogin: user.dataUltimoLogin,
			dataAtualizacao: user.dataAtualizacao,
			token,
		});

		console.log(token);
	} catch (error) {
		console.log(error);
	}
});

module.exports = route;
