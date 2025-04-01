import express from "express";
import bcrypt from "bcrypt";

import {
  dohvati_korisnik_email,
  dohvati_korisnik_kolone,
  kreiraj_korisnik,
} from "../controller/korisnik.js";
import { dohvati_uloga_naziv } from "../controller/uloga";
import { generisi_token } from "../utils/helper";
import connection from "../config.js";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { korisnicko_ime, lozinka } = req.body;

  if (!korisnicko_ime || !lozinka) {
    const error = new Error("Nisu uneti podaci");
    error.status = 400;
    return next(error);
  }

  try {
    const korisnik = (
      await dohvati_korisnik_kolone(
        ["id", "lozinka", "uloga_id"],
        `korisnicko_ime = '${korisnicko_ime}'`
      )
    )[0];
    if (!korisnik) {
      const error = new Error("Nema korisnika imena " + korisnicko_ime);
      error.status = 400;
      return next(error);
    }

    const validnaLozinka = await bcrypt.compare(lozinka, korisnik.lozinka);
    if (!validnaLozinka) {
      const error = new Error("Uneta lozinka nije tacna");
      error.status = 400;
      return next(error);
    }

    const token = generisi_token(korisnik);

    return res.send({ poruka: "Uspesno prijavljen korisnik", token });
  } catch (error) {
    return next(error);
  }
});

router.post("/api/register", async (req, res, next) => {
  const { email, korisnicko_ime, lozinka, uloga } = req.body;
  if (!email || !korisnicko_ime || !lozinka || !uloga) {
    const error = new Error("Nisu uneti podaci");
    error.status = 400;
    return next(error);
  }

  try {
    const [result] = await connection.execute(
      "SELECT * FROM korisnik WHERE email = ? OR korisnicko_ime = ?",
      [email, korisnicko_ime]
    );
    if (result.length) {
      const error = new Error("Korisnik vec postoji");
      error.status = 400;
      return next(error);
    }

    const uloga_obj = (await dohvati_uloga_naziv(uloga))[0];
    if (!uloga_obj) {
      const error = new Error(`Uloga ${uloga} ne postoji`);
      error.status = 400;
      return next(error);
    }
    const uloga_id = uloga_obj.id;

    await kreiraj_korisnik({
      email,
      korisnicko_ime,
      lozinka,
      uloga_id,
    });

    const korisnik = (await dohvati_korisnik_email(email))[0];
    const token = generisi_token(korisnik);

    return res.send({ poruka: "Uspesno napravljen nalog", token });
  } catch (error) {
    return next(error);
  }
});

export default router;
