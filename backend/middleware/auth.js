import jwt from "jsonwebtoken";
import { dohvati_korisnik_id } from "../database.js";
import { upisiKorisnikZaglavlje } from "../index.js";

export default async (req, res, next) => {
  if (req.path === "/api/login" || req.path === "/api/register") return next();

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    const error = new Error("Nije prosledjen token");
    error.status = 400;
    return next(error);
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET || "tajna");

    const korisnik = await dohvati_korisnik_id(id);
    if (!korisnik) {
      const error = new Error("Token cuva podatke nepostojeceg korisnika");
      error.status = 400;
      return next(error);
    }

    upisiKorisnikZaglavlje(req, korisnik);

    next();
  } catch (error) {
    return next(error);
  }
};
