import connection from "../config.js";

export async function kreiraj_objava({ naslov, tekst, autor_id }) {
  const sql = `INSERT INTO objava(naslov, tekst, autor_id) VALUES(?, ?, ?)`;

  await connection.execute(sql, [naslov, tekst, autor_id]);
}

export async function dohvati_objava() {
  const sql = `SELECT * FROM objava`;

  const [rows] = await connection.execute(sql);
  return rows;
}

export async function dohvati_objava_id(id) {
  const sql = `SELECT * FROM objava WHERE id = ?`;

  const [result] = await connection.execute(sql, [id]);
  return result.length ? result[0] : null;
}

//TODO autor moze biti number(id ili uloga_id) ili string(korisnicko_ime ili email)
export async function dohvati_objava_autor(autor_id) {
  if (typeof autor !== "number")
    throw Object.assign(new Error("Parametar nije dobro prosledjen"), {
      status: 400,
    });

  const sql = `SELECT * FROM objava WHERE autor_id = ?`;

  const [result] = await connection.execute(sql, [autor_id]);
  return result;
}

export async function izmeni_objava(id, telo) {
  if (!Object.keys(telo).length) return await dohvati_objava_id(id);

  let objava = await dohvati_objava_id(id);
  if (!objava)
    throw Object.assign(new Error("Ne postoji objava"), { status: 404 });

  const [kolone] = await connection.execute("SHOW COLUMNS FROM objava");
  const validnaPolja = new Set(kolone.map((k) => k.Field));

  const poljaKojeIzmenjujemo = Object.keys(telo).filter(
    (p) => p !== "id" && validnaPolja.has(p)
  );
  if (!poljaKojeIzmenjujemo.length) return objava;

  if (telo.autor_id) {
    const [autor] = await connection.execute(
      "SELECT id FROM korisnik WHERE id = ?",
      [telo.autor_id]
    );

    if (!autor.length)
      throw Object.assign(new Error("Prosledjeni autor_id ne postoji"), {
        status: 400,
      });
  }

  const vrednostiZaAžuriranje = poljaKojeIzmenjujemo.map((p) => telo[p]);

  const setKlauzula = poljaKojeIzmenjujemo.map((p) => `${p} = ?`).join(", ");

  const sql = `UPDATE objava SET ${setKlauzula} WHERE id = ?`;

  await connection.execute(sql, [...vrednostiZaAžuriranje, id]);

  return await dohvati_objava_id(id);
}

export async function obrisi_objava_id(id) {
  const sql = `DELETE FROM objava WHERE id = ?`;

  const [result] = await connection.execute(sql, [id]);
  return result;
}
