import express from "express"
import mongoose from "mongoose"
import router from "./routes/blogs.route.js"
import bodyParser from "body-parser"
import msgRouter from "./routes/messages.route.js"

// Connect to MongoDB database
mongoose
	.connect("mongodb://0.0.0.0:27017/my-brand", { useNewUrlParser: true })
	.then(() => {
		const app = express()
        app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
        app.use("/api/v1/blogs", router)
		app.use("/api/v1/messages", msgRouter)
		app.listen(3000, () => {
			console.log("Server has started!")
		})
	})