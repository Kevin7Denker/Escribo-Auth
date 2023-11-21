require("dotenv").config(); 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = express.Router();

const authRoutes = require("./routes/auth_routes");
const publicRoutes = require("./routes/public_routes");
const privateRoutes = require("./routes/private_routes");

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;
const port = 3000;

const app = express();
app.use(cors());
 
app.use(express.json());

app.options("*", cors());

router.get("/", (req, res) => {
	res.status(200).json({ msg: "Welcome to Denker's Api" });
});

app.use("/", publicRoutes);
app.use("/auth", authRoutes);
app.use("/api", privateRoutes);

mongoose
	.connect(
		`mongodb+srv://${dbUser}:${dbPass}@cluster.irye11p.mongodb.net/?retryWrites=true&w=majority`
	)
	.then(() => {
		app.listen(port);
		console.log("\n Conectado ao MongoDB");
		console.log(`\n Utilize a Url: http://localhost:${port}`);
	})
	.catch((error) => console.log("Erro: " + error));
