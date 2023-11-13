import * as dotenv from "dotenv";
import path from "path"; // Importer 'path' for å håndtere filstier

if (process.env.NODE_ENV !== "production") {
	dotenv.config();
}

import OpenAI from "openai";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
	apiKey: process.env.OPENAI,
});

app.post("/", async (req, res) => {
	try {
		const prompt = req.body.prompt;

		const aiResponse = await openai.images.generate({
			prompt,
			n: 1,
			style: vivid,
			size: "1024x1024",
		});

		console.log(aiResponse);

		const image = aiResponse.data[0].url;
		res.send({ image });
	} catch (err) {
		console.error(err);
		res.status(500).send(err.message);
	}
});

// Tjener de statiske filene som Vite har bygget i produksjonsmodus
if (process.env.NODE_ENV === "production") {
	app.use(express.static("dist"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "dist", "index.html"));
	});
}

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
