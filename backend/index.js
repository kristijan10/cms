import express from "express";
import "dotenv/config";
import cors from "cors";

import auth from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import korisnikRoutes from "./routes/korisnik.js";
import ulogaRoutes from "./routes/uloga.js";
import objavaRoutes from "./routes/objava.js";
import error from "./middleware/error.js";

const app = express();

app.use(express.json());

// Auth middleware
app.use(auth);

// Rute za autentifikaciju
app.use("/api", authRoutes);

// Rute za tabelu korisnik
app.use("/api/korisnik", korisnikRoutes);

// Rute za tabelu uloga
app.use("/api/uloga", ulogaRoutes);

// Rute za tabelu objava
app.use("/api/objava", objavaRoutes);

// Error handling middleware
app.use(error);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
