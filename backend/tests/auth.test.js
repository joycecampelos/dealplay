import request from "supertest";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import authRoutes from "../src/routes/authRoutes.js";

// Carrega o .env.test
dotenv.config({ path: ".env.test" });

// Configura app isolado para os testes
const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

// Cria cliente Supabase para preparar dados de teste
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Variáveis de apoio
let testUser = {
  username: "login_teste",
  email: "login_teste@example.com",
  password: "Senha@1234",
  name: "Usuário Login Teste"
};

// Função utilitária para gerar hash bcrypt da senha (opcional)
import bcrypt from "bcrypt";

beforeAll(async () => {
  // Limpa a tabela de teste
  await supabase.from("users").delete().neq("email", "admin@example.com");

  // Insere um usuário de teste
  const hashed = await bcrypt.hash(testUser.password, 10);
  await supabase.from("users").insert([
    {
      username: testUser.username,
      email: testUser.email,
      password: hashed,
      name: testUser.name,
      role: "user"
    }
  ]);
});

afterAll(async () => {
  // Limpa a tabela após os testes
  await supabase.from("users").delete().neq("email", "admin@example.com");
});

describe("Testes da rota /auth/login", () => {
  test("Deve fazer login com credenciais válidas", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.email).toBe(testUser.email);
  });

  test("Deve retornar erro se a senha estiver incorreta", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: "SenhaErrada@123"
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Senha incorreta/i);
  });

  test("Deve retornar erro se o email não existir", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "inexistente@example.com",
      password: "Senha@1234"
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Usuário não encontrado/i);
  });

  test("Deve retornar erro se faltar email ou senha", async () => {
    const res = await request(app).post("/auth/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Email e senha são obrigatórios/i);
  });

  test("Deve retornar erro se senha for muito curta", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: "123"
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/mínimo 8 caracteres/i);
  });
});
