import connection from "./config.js";

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
  return rows[0];
}

export async function dohvati_uloga_naziv(naziv) {
  const sql = `SELECT * FROM uloga WHERE naziv = ?`;

  const [rows] = await connection.execute(sql, [naziv]);
  return rows[0];
}

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
