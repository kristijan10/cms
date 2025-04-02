import express from "express";
import {
  dohvati_objava,
  dohvati_objava_id,
  izmeni_objava,
  kreiraj_objava,
  obrisi_objava_id,
} from "../controller/objava.js";
import { dohvati_korisnik_kolone } from "../controller/korisnik.js";
import { provera_parametra_id } from "../utils/helper.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { naslov, tekst } = req.body;
    const autor_id = req?.korisnik?.id;

    if (!naslov || !tekst)
      return next(
        Object.assign(new Error("Nisu prosledjeni potrebni podaci"), {
          status: 400,
        })
      );

    if (!autor_id)
      return next(
        Object.assign(new Error("Korisnik nije prijavljen"), {
          status: 401,
        })
      );

    await kreiraj_objava({ naslov, tekst, autor_id });

    return res.send("Uspesno kreirana objava");
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const objave = await dohvati_objava();

    return res.send(objave);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = provera_parametra_id(req.params);
    const objava = await dohvati_objava_id(id);
    if (!objava) return res.status(204).send([]);

    return res.send(objava);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = provera_parametra_id(req.params);
    const izmenjena_objava = await izmeni_objava(id, req.body);

    return res.send(izmenjena_objava);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = provera_parametra_id(req.params);
    await obrisi_objava_id(id);

    return res.send(`Uspesno obrisana objava id-ja ${id}`);
  } catch (error) {
    next(error);
  }
});

export default router;
