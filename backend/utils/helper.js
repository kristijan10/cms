import jwt from "jsonwebtoken";

export function generisi_token({ id, uloga_id }) {
  return jwt.sign({ id, uloga_id }, process.env.JWT_SECRET || "tajna");
}

export function upisiKorisnikZaglavlje(
  req,
  { id, email, korisnicko_ime, uloga_id }
) {
  req.korisnik = { id, email, korisnicko_ime, uloga_id };
}

export function provera_parametra_id({ id }) {
  const checked_id = Number(id);
  if (!Number.isInteger(checked_id) || checked_id < 0) {
    const error = new Error("Id korisnika nije vazeci");
    error.status = 400;
    throw error;
  }

  return checked_id;
}
