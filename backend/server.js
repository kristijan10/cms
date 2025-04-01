import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcrypt";
import connection, {
  dohvati_korisnik,
  dohvati_korisnik_email,
  dohvati_korisnik_id,
  dohvati_korisnik_ime,
  dohvati_korisnik_kolone,
  dohvati_uloga,
  dohvati_uloga_id,
  dohvati_uloga_naziv,
  izmeni_korisnik,
  izmeni_uloga,
  kreiraj_korisnik,
  obrisi_korisnik_id,
} from "./database.js";

const PORT = 8000;

const app = express();

app.use(express.json());

// Auth middleware
app.use(async (req, res, next) => {
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
});

app.post("/api/login", async (req, res, next) => {
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

app.post("/api/register", async (req, res, next) => {
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

// Tabela korisnik u bazi
app.get("/api/korisnik", async (req, res, next) => {
  try {
    const korisnici = await dohvati_korisnik();
    res.send(korisnici);
  } catch (error) {
    next(error);
  }
});

app.get("/api/korisnik/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    const error = new Error("Id korisnika nije vazeci");
    error.status = 400;
    return next(error);
  }

  try {
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

app.put("/api/korisnik/:id", async (req, res, next) => {
  try {
    const id = provera_parametra_id(req.params);
    const izmena = await izmeni_korisnik(id, req.body);

    return res.send(izmena);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/korisnik/:id", async (req, res, next) => {
  try {
    const id = provera_parametra_id(req.params);
    await obrisi_korisnik_id(id);

    return res.send({ poruka: "Uspesno obrisan korisnik" });
  } catch (error) {
    next(error);
  }
});

// Tabela uloga u bazi
app.get("/api/uloga", async (req, res, next) => {
  try {
    const uloge = await dohvati_uloga();

    return res.send(uloge);
  } catch (error) {
    next(error);
  }
});

app.get("/api/uloga/:id", async (req, res, next) => {
  try {
    const id = provera_parametra_id(req.params);
    const uloga = await dohvati_uloga_id(id);
    return res.send(uloga);
  } catch (error) {
    next(error);
  }
});

app.put("/api/uloga/:id", async (req, res, next) => {
  try {
    const id = provera_parametra_id(req.params);
    const izmena = await izmeni_uloga(id, req.body);

    return res.send(izmena);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/uloga/:id", async (req, res, next) => {});

function generisi_token({ id, uloga_id }) {
  return jwt.sign({ id, uloga_id }, process.env.JWT_SECRET || "tajna");
}

function upisiKorisnikZaglavlje(req, { id, email, korisnicko_ime, uloga_id }) {
  req.korisnik = { id, email, korisnicko_ime, uloga_id };
}

function provera_parametra_id({ id }) {
  const checked_id = Number(id);
  if (!Number.isInteger(checked_id) || checked_id < 0) {
    const error = new Error("Id korisnika nije vazeci");
    error.status = 400;
    throw error;
  }

  return checked_id;
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  return res.status(error.status || 500).send({
    poruka: error.message || error.sql || "Greska na serveru",
    // stack: error.stack,
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
