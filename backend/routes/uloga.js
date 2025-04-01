import express from "express";

import {
  dohvati_uloga,
  dohvati_uloga_id,
  izmeni_uloga,
} from "../controller/uloga";
import { provera_parametra_id } from "../utils/helper";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const uloge = await dohvati_uloga();

    return res.send(uloge);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = provera_parametra_id(req.params);
    const uloga = await dohvati_uloga_id(id);
    return res.send(uloga);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = provera_parametra_id(req.params);
    const izmena = await izmeni_uloga(id, req.body);

    return res.send(izmena);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {});

export default router;
