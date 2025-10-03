import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Bem vindo(a) ao backend do DealPlay!");
});

app.listen(3000);