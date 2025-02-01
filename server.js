import * as dotenv from "dotenv";
import path from "path"; // Importer 'path' for å håndtere filstier
import OpenAI from "openai";
import express from "express";
import cors from "cors";

// Laster inn miljøvariabler fra .env-filen i utviklingsmiljøet
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Initialiserer en ny Express-applikasjon
const app = express();

// Omdirigerer alle HTTP-forespørsler til HTTPS i produksjonsmiljøet
app.use((req, res, next) => {
  if (
    req.header("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV === "production"
  ) {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
});

// Aktiverer CORS (Cross-Origin Resource Sharing) for å tillate forespørsler fra forskjellige domener.
app.use(
  cors({
    origin: "*", // Tillater alle domener (kan begrense dette i prod)
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

// Gjør det mulig for Express å tolke JSON i innkommende forespørsler.
app.use(express.json());

// Initialiserer OpenAI-API-klienten med API-nøkkelen.
const openai = new OpenAI({
  apiKey: process.env.OPENAI,
});

// Definerer en rute for POST-forespørsler til rot-URL-en.
app.post("/", async (req, res) => {
  try {
    // Henter prompt-verdien.
    const prompt = req.body.prompt;

    // Genererer et bilde basert på prompten ved hjelp av OpenAI API.
    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
    });

    // Logger svaret fra OpenAI API.
    console.log(aiResponse);

    // Sender bildets URL som respons.
    const image = aiResponse.data[0].url;
    res.send({ image });
  } catch (err) {
    // Logger og sender eventuelle feilmeldinger.
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Omdirigerer alle GET-forespørsler til index.html, for å støtte single-page applikasjoner.
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  });
}

// Starter serveren på en spesifikk port (hentet fra miljøvariablene, eller 8080 som standard).
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
