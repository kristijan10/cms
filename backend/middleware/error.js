export default (error, req, res, next) => {
  console.log(error);
  return res.status(error.status || 500).send({
    poruka: error.message || error.sql || "Greska na serveru",
    // stack: error.stack,
  });
};
