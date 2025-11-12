import bcrypt from "bcrypt";
import request from "supertest";
import app from "../../server.js";
import supabase from "../../src/config/supabaseConfig.js";

let userTest = {
  name: "João da Silva",
  username: "joaosilva",
  email: "joao.silva@example.com",
  password: "SenhaSegura@1234"
};

beforeAll(async () => {
  await supabase.from("users").delete().neq("id", 0);

  await supabase.from("users").insert([
    {
      name: userTest.name,
      username: userTest.username,
      email: userTest.email,
      password: await bcrypt.hash(userTest.password, 10),
      role: "user"
    }
  ]);
});

afterAll(async () => {
  await supabase.from("users").delete().neq("id", 0);
});

describe("Testes de autenticação - /auth/login", () => {
  test("Deve retornar erro se o e-mail não for informado", async () => {
    const res = await request(app).post("/auth/login").send({
      password: userTest.password
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/O campo e-mail é obrigatório/i);
  });

  test("Deve retornar erro se a senha não for informada", async () => {
    const res = await request(app).post("/auth/login").send({
      email: userTest.email
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/O campo senha é obrigatório/i);
  });

  test("Deve retornar erro se não for encontrado usuário com o e-mail informado", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "inexistente@example.com",
      password: userTest.password
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Usuário não encontrado/i);
  });

  test("Deve retornar erro se a senha estiver incorreta", async () => {
    const res = await request(app).post("/auth/login").send({
      email: userTest.email,
      password: "SenhaIncorreta@123"
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Senha incorreta/i);
  });

  test("Deve autenticar com credenciais válidas", async () => {
    const res = await request(app).post("/auth/login").send({
      email: userTest.email,
      password: userTest.password
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.email).toBe(userTest.email);
  });
});
