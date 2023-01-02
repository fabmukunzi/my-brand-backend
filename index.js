import express from "express"
import mongoose from "mongoose"
import router from "./routes/blogs.route.js"
import bodyParser from "body-parser"
import msgRouter from "./routes/messages.route.js"
import usersRoute from "./routes/users.route.js"
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
dotenv.config()

// var upload = multer();
const loadJSON = (path) =>
JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const swaggerDocument = loadJSON("./swagger.json");
const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');

const PORT=process.env.PORT||3000;
const app = express();
// app.use(upload.array()); 
// for parsing multipart/form-data
app.use(cors())
app.use(express.static('public'));
     // app.use(bodyParser.urlencoded());
      app.use(bodyParser.urlencoded({ extended: false }))
	  // parse application/json
      app.use(bodyParser.json())
	  //upload
	  app.use('/upload',express.static('upload'));
// Connect to MongoDB database
let conn_str = "";
if (process.env.NODE_ENV == "test") {
    conn_str = "mongodb://0.0.0.0:27017/my-brand";
} else {
    conn_str = `mongodb+srv://fabmukunzi:${process.env.ATLASPASSWORD}@cluster0.sqct07v.mongodb.net/my-brand?retryWrites=true&w=majority`;
}

mongoose.connect(
conn_str,
{ 
useNewUrlParser: true, 
useUnifiedTopology: true 
},(err) => {
if (err) {
console.log("Database connection error",err);
console.log(conn_str)
} else {
console.log("Database connected successfully!");
console.log(conn_str)
}});

mongoose.set("strictQuery", false);
	//starting a server
	app.listen(PORT, () => {
		console.log(`Server has started! on Port ${PORT}!`)
	   })
	   app.get("/",(req,res)=>{
		let link="https://my-brand-backend.up.railway.app/api/v1/api-docs/";
		res.send(`<h1>Welcome to my APIs for my swagger documentation   <a href=${link}>click here</a></h1>`);
	   })
        app.use("/api/v1/blogs", router)
		app.use("/api/v1/messages", msgRouter)
		app.use("/api/v1/auth/", usersRoute);
		app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCss}))
	export default app;