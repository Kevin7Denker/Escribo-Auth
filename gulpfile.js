const gulp = require("gulp");
const axios = require("axios");
gulp.task("cadastro", async () => {

	const apiUrl = "http://localhost:3000";
	const rotaCadastro = "/auth/cadastro";
	
	try {
		const response = await axios.post(`${apiUrl}${rotaCadastro}`, {
			nome: "Exemplo", 
			email: "exemplo@email.com",
			telefone: "123456789",
			senha: "senha123"
		});
	
		console.log(response.data); 
	
	} catch (error) {
		console.error(error); 
	}
});

gulp.task("default", gulp.series("cadastro")); 