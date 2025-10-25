import request from "supertest";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import userRoutes from "../src/routes/userRoutes.js";
import authRoutes from "../src/routes/authRoutes.js";
import dotenv from "dotenv";

// Carrega variáveis do .env.test
dotenv.config({ path: ".env.test" });

// Cria app Express isolado
const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Cria cliente Supabase (para limpar o banco antes/depois)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Variáveis usadas entre os testes
let adminToken;
let userId;

beforeAll(async () => {
  // Limpa a tabela antes dos testes (exceto admin fixo)
  await supabase.from("users").delete().neq("email", "admin@example.com");

  // Faz login do admin para gerar token
  const res = await request(app)
    .post("/auth/login")
    .send({ email: "admin@example.com", password: "Senha@1234" });

  expect(res.statusCode).toBe(200);
  adminToken = res.body.token;
});

afterAll(async () => {
  // Limpa a tabela de teste novamente ao final
  await supabase.from("users").delete().neq("email", "admin@example.com");
});

describe("Testes de integração do CRUD de usuários", () => {
  test("Deve criar um novo usuário", async () => {
    const novoUsuario = {
      username: "teste_user",
      email: "teste_user@example.com",
      password: "Senha@1234",
      name: "Usuário de Teste"
    };

    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(novoUsuario);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe(novoUsuario.email);

    userId = res.body.id; // salva o ID para os próximos testes
  });

  test("Deve listar todos os usuários (autenticado)", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(u => u.id === userId)).toBe(true);
  });

  test("Deve retornar erro ao listar sem token", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Token não fornecido");
  });

  test("Deve buscar o usuário pelo ID", async () => {
    const res = await request(app)
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body).toHaveProperty("email");
  });

  test("Deve atualizar o usuário existente", async () => {
    const atualizacao = { name: "Usuário Atualizado" };

    const res = await request(app)
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(atualizacao);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Usuário Atualizado");
  });

  test("Deve recusar criação de e-mail duplicado", async () => {
    const duplicado = {
      username: "teste_dup",
      email: "teste_user@example.com", // mesmo email
      password: "Senha@1234",
      name: "Duplicado"
    };

    const res = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(duplicado);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/já está cadastrado/i);
  });

  test("Deve excluir o usuário criado", async () => {
    const res = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/removido com sucesso/i);
  });

  test("Deve retornar erro ao excluir com token inválido", async () => {
    const res = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", "Bearer token_invalido");

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/Token inválido/i);
  });
});
