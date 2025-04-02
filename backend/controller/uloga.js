import connection from "../config.js";

export async function kreiraj_uloga({ naziv, opis }) {
  const sql = `INSERT INTO uloga(naziv, opis) VALUES (?, ?)`;

  const [result] = await connection.execute(sql, [naziv, opis]);
  return result;
}

export async function dohvati_uloga() {
  const sql = `SELECT * FROM uloga`;

  const [rows] = await connection.execute(sql);
  return rows;
}

export async function dohvati_uloga_id(id) {
  const sql = `SELECT * FROM uloga WHERE id = ?`;

  const [rows] = await connection.execute(sql, [id]);
  return rows.length ? rows[0] : null;
}

export async function dohvati_uloga_naziv(naziv) {
  const sql = `SELECT * FROM uloga WHERE naziv = ?`;

  const [rows] = await connection.execute(sql, [naziv]);
  return rows.length ? rows[0] : null;
}

export async function izmeni_uloga(id, telo) {
  let uloga = await dohvati_uloga_id(id);
  if (!uloga)
    throw Object.assign(new Error("Ne postoji uloga"), { status: 404 });

  const [kolone] = await connection.execute("SHOW COLUMNS FROM uloga");
  const validnaPolja = new Set(kolone.map((k) => k.Field));

  const poljaKojeIzmenjujemo = Object.keys(telo).filter(
    (p) => p !== "id" && validnaPolja.has(p)
  );
  if (!poljaKojeIzmenjujemo.length) return uloga;

  const vrednostiZaAžuriranje = poljaKojeIzmenjujemo.map((p) => telo[p]);

  const setKlauzula = poljaKojeIzmenjujemo.map((p) => `${p} = ?`).join(", ");

  const sql = `UPDATE uloga SET ${setKlauzula} WHERE id = ?`;

  await connection.execute(sql, [...vrednostiZaAžuriranje, id]);

  return await dohvati_uloga_id(id);
}

export async function obrisi_uloga_id(id) {
  const sql = `DELETE FROM uloga WHERE id = ?`;

  const [result] = await connection.execute(sql, [id]);
  return result;
}

export async function obrisi_uloga_naziv(naziv) {
  const sql = `DELETE FROM uloga WHERE naziv = ?`;

  const [result] = await connection.execute(sql, [naziv]);
  return result;
}
