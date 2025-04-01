import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "cms",
});

// CREATE korisnik
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

// CREATE uloga
export async function kreiraj_uloga({ naziv, opis }) {
  const sql = `INSERT INTO uloga(naziv, opis) VALUES (?, ?)`;

  const [result] = await connection.execute(sql, [naziv, opis]);
  return result;
}

// READ uloga
export async function dohvati_uloga() {
  const sql = `SELECT * FROM uloga`;

  const [rows] = await connection.execute(sql);
  return rows;
}

export async function dohvati_uloga_id(id) {
  const sql = `SELECT * FROM uloga WHERE id = ?`;

  const [rows] = await connection.execute(sql, [id]);
  return rows[0];
}

export async function dohvati_uloga_naziv(naziv) {
  const sql = `SELECT * FROM uloga WHERE naziv = ?`;

  const [rows] = await connection.execute(sql, [naziv]);
  return rows[0];
}

// UPDATE uloga
export async function izmeni_uloga(id, telo) {
  const poljaZaIzmenu = Object.keys(telo).filter((polje) => polje !== "id");

  let uloga = await dohvati_uloga_id(id);
  if (!uloga) {
    const error = new Error("Ne postoji uloga");
    error.status = 404;
    throw error;
  }
  if (!poljaZaIzmenu.length) return uloga;

  const [kolone] = await connection.execute("SHOW COLUMNS FROM uloga");
  const validnaPolja = kolone.map((kolona) => kolona["Field"]);

  const poljaKojeIzmenjujemo = poljaZaIzmenu.filter((naziv) =>
    validnaPolja.includes(naziv)
  );
  if (!poljaKojeIzmenjujemo.length) return uloga;

  const vrednostiZaAžuriranje = poljaKojeIzmenjujemo.map(
    (polje) => telo[polje]
  );

  const setKlauzula = poljaKojeIzmenjujemo
    .map((polje) => `${polje} = ?`)
    .join(", ");

  const sql = `UPDATE uloga SET ${setKlauzula} WHERE id = ?`;

  vrednostiZaAžuriranje.push(id);

  await connection.execute(sql, vrednostiZaAžuriranje);

  uloga = await dohvati_uloga_id(id);
  return uloga;
}

// DELETE uloga
export async function obrisi_uloga_id(id) {
  const sql = `DELETE FROM uloga WHERE id = ?`;

  try {
    const [result] = await connection.execute(sql, [id]);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function obrisi_uloga_naziv(naziv) {
  const sql = `DELETE FROM uloga WHERE naziv = ?`;

  try {
    const [result] = await connection.execute(sql, [naziv]);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default connection;
