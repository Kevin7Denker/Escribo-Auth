const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	nome: String,
	email: String,
	telefone: String,
	senha: String,
	dataCriacao: { type: Date, default: Date.now },
	dataUltimoLogin: { type: Date, default: Date.now },
	dataAtualizacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);