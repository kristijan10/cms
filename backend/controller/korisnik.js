import bcrypt from "bcrypt";
import connection from "../config.js";

export const kreiraj_korisnik = async ({
  email,
  korisnicko_ime,
  lozinka,
  uloga_id,
}) => {
  const kriptovana_lozinka = await bcrypt.hash(lozinka, 10);

  const sql = `INSERT INTO korisnik(email, korisnicko_ime, lozinka, uloga_id) VALUES (?, ?, ?, ?)`;
  const [result] = await connection.execute(sql, [
    email,
    korisnicko_ime,
    kriptovana_lozinka,
    uloga_id,
  ]);

  return result;
};

// READ korisnik
export async function dohvati_korisnik() {
  const sql = `SELECT id, email, korisnicko_ime, uloga_id FROM korisnik`;

  const [result] = await connection.execute(sql);
  return result;
}

export async function dohvati_korisnik_id(id) {
  const sql = `SELECT id, email, korisnicko_ime, uloga_id FROM korisnik WHERE id = ?`;
  // const sql = "SELECT * FROM korisnik WHERE id = ?";

  const [result] = await connection.execute(sql, [id]);
  return result[0];
}

export async function dohvati_korisnik_ime(korisnicko_ime) {
  const sql = `SELECT id, email, korisnicko_ime, uloga_id FROM korisnik WHERE korisnicko_ime = ?`;

  const [result] = await connection.execute(sql, [korisnicko_ime]);
  return result[0];
}

export async function dohvati_korisnik_email(email) {
  const sql = `SELECT id, email, korisnicko_ime, uloga_id FROM korisnik WHERE email = ?`;

  const [result] = await connection.execute(sql, [email]);
  return result;
}

export async function dohvati_korisnik_kolone(niz_kolone, uslov = null) {
  niz_kolone = Array.isArray(niz_kolone) ? niz_kolone : [niz_kolone];

  const [kolone] = await connection.execute("SHOW COLUMNS FROM korisnik");
  const validneKolone = kolone.map((kolona) => kolona["Field"]);

  const koloneZaIzmenu = niz_kolone.filter((kolona) =>
    validneKolone.includes(kolona)
  );

  const koloneZaUpit = koloneZaIzmenu.join(", ");

  let sql = `SELECT ${koloneZaUpit} FROM korisnik`;
  if (uslov) sql += ` WHERE ${uslov}`;

  const [rows] = await connection.execute(sql);
  return rows;
}

// TODO: pri dodeli uloga_id proveriti da li taj id postoji u bazi
// UPDATE korisnik
export async function izmeni_korisnik(id, telo) {
  const poljaZaIzmenu = Object.keys(telo);

  let korisnik = await dohvati_korisnik_id(id);
  if (!poljaZaIzmenu.length) return korisnik;
  if (!korisnik) {
    const error = new Error("Ne postoji korisnik");
    error.status = 404;
    throw error;
  }

  const [kolone] = await connection.execute("SHOW COLUMNS FROM korisnik");
  const validnaPolja = kolone.map((kolona) => kolona["Field"]);

  const poljaKojeIzmenjujemo = poljaZaIzmenu.filter((naziv) =>
    validnaPolja.includes(naziv)
  );

  const vrednostiZaAžuriranje = await Promise.all(
    poljaKojeIzmenjujemo.map(async (polje) => {
      if (polje === "lozinka") {
        const hashed = await bcrypt.hash(telo[polje], 10);
        return hashed;
      }
      return telo[polje];
    })
  );

  const setKlauzula = poljaKojeIzmenjujemo
    .map((polje) => `${polje} = ?`)
    .join(", ");

  const sql = `UPDATE korisnik SET ${setKlauzula} WHERE id = ?`;

  vrednostiZaAžuriranje.push(id);

  await connection.execute(sql, vrednostiZaAžuriranje);

  korisnik = await dohvati_korisnik_id(id);
  return korisnik;
}

// DELETE korisnik
export async function obrisi_korisnik_id(id) {
  const sql = `DELETE FROM korisnik WHERE id = ?`;

  const korisnik = await dohvati_korisnik_id(id);
  if (!korisnik) {
    const error = new Error("Korisnik ne postoji");
    error.status = 404;
    throw error;
  }

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
