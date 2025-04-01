import express from "express";

import {
  dohvati_korisnik,
  dohvati_korisnik_id,
  izmeni_korisnik,
  obrisi_korisnik_id,
} from "../controller/korisnik.js";
import { provera_parametra_id } from "../utils/helper.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const korisnici = await dohvati_korisnik();
    res.send(korisnici);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = provera_parametra_id(req.params);
    const korisnik = await dohvati_korisnik_id(id);
    if (!korisnik) {
      const error = new Error(`Korisnik id-ja ${id} ne postoji`);
      error.status = 404;
      return next(error);
    }

    return res.send(korisnik);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = provera_parametra_id(req.params);
    const izmena = await izmeni_korisnik(id, req.body);

    return res.send(izmena);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = provera_parametra_id(req.params);
    await obrisi_korisnik_id(id);

    return res.send({ poruka: "Uspesno obrisan korisnik" });
  } catch (error) {
    next(error);
  }
});

export default router;
