import bcrypt from "bcrypt";
import connection from "../config.js";

export async function kreiraj_korisnik({
  email,
  korisnicko_ime,
  lozinka,
  uloga_id,
}) {
  const kriptovana_lozinka = await bcrypt.hash(lozinka, 10);

  const sql = `INSERT INTO korisnik(email, korisnicko_ime, lozinka, uloga_id) VALUES (?, ?, ?, ?)`;
  const [result] = await connection.execute(sql, [
    email,
    korisnicko_ime,
    kriptovana_lozinka,
    uloga_id,
  ]);

  return result;
}

// READ korisnik
export async function dohvati_korisnik() {
  const sql = `SELECT id, email, korisnicko_ime, uloga_id FROM korisnik`;

  const [korisnici] = await connection.execute(sql);
  return korisnici;
}

export async function dohvati_korisnik_id(id) {
  const sql = `SELECT id, email, korisnicko_ime, uloga_id FROM korisnik WHERE id = ?`;
  // const sql = "SELECT * FROM korisnik WHERE id = ?";

  const [result] = await connection.execute(sql, [id]);
  return result.length ? result[0] : null;
}

export async function dohvati_korisnik_ime(korisnicko_ime) {
  const sql = `SELECT id, email, korisnicko_ime, uloga_id FROM korisnik WHERE korisnicko_ime = ?`;

  const [result] = await connection.execute(sql, [korisnicko_ime]);
  return result.length ? result[0] : null;
}

export async function dohvati_korisnik_email(email) {
  const sql = `SELECT id, email, korisnicko_ime, uloga_id FROM korisnik WHERE email = ?`;

  const [result] = await connection.execute(sql, [email]);
  return result.length ? result[0] : null;
}

export async function dohvati_korisnik_kolone(niz_kolone, uslov = null) {
  niz_kolone = [].concat(niz_kolone);

  const [kolone] = await connection.execute("SHOW COLUMNS FROM korisnik");
  const validneKolone = new Set(kolone.map((k) => k.Field));

  const koloneZaUpit = niz_kolone
    .filter((k) => validneKolone.has(k))
    .join(", ");

  let sql = `SELECT ${koloneZaUpit} FROM korisnik ${
    uslov ? `WHERE ${uslov}` : ""
  }`;
  console.log(sql);

  const [rows] = await connection.execute(sql);
  return rows;
}

export async function dohvati_korisnik_uloga(uloga) {
  if (typeof uloga !== "number" && typeof uloga !== "string") {
    const error = new Error("Parametar pogresnog tipa prosledjen");
    error.status = 400;
    throw error;
  }

  const uloga_id =
    typeof uloga === "number"
      ? uloga
      : (
          await connection.execute("SELECT id FROM uloga WHERE naziv = ?", [
            uloga,
          ])
        )[0]?.[0]?.id;

  const sql = `SELECT id, email, korisnicko_ime, uloga_id FROM korisnik WHERE uloga_id = ?`;

  const [korisnici] = await connection.execute(sql, [uloga_id]);
  return korisnici;
}

// UPDATE korisnik
export async function izmeni_korisnik(id, telo) {
  if (!Object.keys(telo).length) return await dohvati_korisnik_id(id);

  let korisnik = await dohvati_korisnik_id(id);
  if (!korisnik)
    throw Object.assign(new Error("Ne postoji korisnik"), { status: 404 });

  const [kolone] = await connection.execute("SHOW COLUMNS FROM korisnik");
  // const validnaPolja = kolone.map((kolona) => kolona["Field"]);
  const validnaPolja = new Set(kolone.map((k) => k.Field));

  // const poljaKojeIzmenjujemo = Object.keys(telo).filter((naziv) =>
  //   validnaPolja.includes(naziv)
  // );
  const poljaKojeIzmenjujemo = Object.keys(telo).filter(
    (p) => p !== "id" && validnaPolja.has(p)
  );
  if (!poljaKojeIzmenjujemo.length) return korisnik;

  if (telo.uloga_id) {
    const [uloga] = await connection.execute(
      "SELECT id FROM uloga WHERE id = ?",
      [telo.uloga_id]
    );

    if (!uloga.length)
      throw Object.assign(new Error("Prosledjena uloga ne postoji"), {
        status: 400,
      });
  }

  const vrednostiZaAžuriranje = await Promise.all(
    poljaKojeIzmenjujemo.map(async (p) =>
      p === "lozinka" ? await bcrypt.hash(telo[p], 10) : telo[p]
    )
  );

  const setKlauzula = poljaKojeIzmenjujemo.map((p) => `${p} = ?`).join(", ");

  const sql = `UPDATE korisnik SET ${setKlauzula} WHERE id = ?`;

  await connection.execute(sql, [...vrednostiZaAžuriranje, id]);

  return await dohvati_korisnik_id(id);
}

// DELETE korisnik
export async function obrisi_korisnik_id(id) {
  const korisnik = await dohvati_korisnik_id(id);
  if (!korisnik)
    throw Object.assign(new Error("Ne postoji korisnik"), { status: 404 });

  const sql = `DELETE FROM korisnik WHERE id = ?`;

  const [result] = await connection.execute(sql, [id]);
  return result;
}

export async function obrisi_korisnik_ime(korisnicko_ime) {
  const sql = `DELETE FROM korisnik WHERE korisnicko_ime = ?`;

  const [result] = await connection.execute(sql, [korisnicko_ime]);
  return result;
}

export async function obrisi_korisnik_email(email) {
  const sql = `DELETE FROM korisnik WHERE email = ?`;

  const [result] = await connection.execute(sql, [email]);
  return result;
}
