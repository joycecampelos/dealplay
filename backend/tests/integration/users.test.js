import bcrypt from "bcrypt";
import request from "supertest";
import app from "../../server.js";
import supabase from "../../src/config/supabaseConfig.js";

let userAdminTest = {
  name: "João da Silva",
  username: "joaosilva",
  email: "joao.silva@example.com",
  password: "SenhaSegura@1234"
};

let usersAnyTest = [
  {
    name: "Maria da Silva",
    username: "mariadasilva",
    email: "maria.silva@example.com",
    password: "SenhaSegura@1234"
  },
  {
    name: "Carlos Pereira",
    username: "carlospereira",
    email: "carlos.pereira@example.com",
    password: "SenhaSegura@1234"
  }
];

beforeAll(async () => {
  await supabase.from("users").delete().neq("id", 0);

  await supabase.from("users").insert([
    {
      name: userAdminTest.name,
      username: userAdminTest.username,
      email: userAdminTest.email,
      password: await bcrypt.hash(userAdminTest.password, 10),
      role: "admin"
    }
  ]);

  const resAdmin = await request(app).post("/auth/login").send({
    email: userAdminTest.email,
    password: userAdminTest.password
  });
  userAdminTest.token = resAdmin.body.data.token;
});

afterAll(async () => {
  await supabase.from("users").delete().neq("id", 0);
});

describe("CRUD de usuários - /users", () => {
  describe("Criação de usuários", () => {
    test("Deve criar usuário sem token", async () => {
      const res = await request(app).post("/users").send(usersAnyTest[0]);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");

      const resUser = await request(app).post("/auth/login").send({
        email: usersAnyTest[0].email,
        password: usersAnyTest[0].password
      });
      usersAnyTest[0].id = resUser.body.data.id;
      usersAnyTest[0].token = resUser.body.data.token;
    });

    test("Deve retornar erro se os campos obrigatórios estiverem ausentes", async () => {
      const res = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({
          username: "usuario_teste"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Campos obrigatórios ausentes/);
    });

    test("Deve retornar erro se a senha for menos que 8 caracteres", async () => {
      const res = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({
          name: usersAnyTest[1].name,
          username: usersAnyTest[1].username,
          email: usersAnyTest[1].email,
          password: "Ab1@"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/A senha deve ter no mínimo 8 caracteres/);
    });

    test("Deve retornar erro se a senha não contiver letra maiúscula, número ou símbolo", async () => {
      const res = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({
          name: usersAnyTest[1].name,
          username: usersAnyTest[1].username,
          email: usersAnyTest[1].email,
          password: "senhasegura"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/A senha deve conter pelo menos uma letra maiúscula, um número e um símbolo/);
    });

    test("Deve retornar erro ao criar usuário com e-mail duplicado", async () => {
      const res = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({
          name: "Outro Usuário",
          username: "outro_usuario",
          email: usersAnyTest[0].email,
          password: "SenhaSegura@1234"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/já está cadastrado/);
    });

    test("Deve retornar erro ao criar usuário com nome de usuário duplicado", async () => {
      const res = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({
          name: "Outro Usuário",
          username: usersAnyTest[0].username,
          email: "outro_usuario@example.com",
          password: "SenhaSegura@1234"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/já está em uso/);
    });
  });

  describe("Listagem de usuários", () => {
    test("Deve retornar erro ao listar usuários sem token", async () => {
      const res = await request(app).get("/users");

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token não fornecido/i);
    });

    test("Deve retornar erro ao listar usuários com token inválido", async () => {
      const res = await request(app)
        .get("/users")
        .set("Authorization", "Bearer token_invalido");

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token inválido ou expirado/i);
    });

    test("Deve retornar erro ao listar usuários com token de usuário comum", async () => {
      const res = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${usersAnyTest[0].token}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Acesso negado/i);
    });

    test("Deve listar usuários com token de administrador", async () => {
      const res = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${userAdminTest.token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Busca de usuários por ID", () => {
    test("Deve retornar erro ao tentar buscar usuário sem token", async () => {
      const res = await request(app).get("/users/1");

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token não fornecido/i);
    });

    test("Deve retornar erro ao tentar buscar usuário com token inválido", async () => {
      const res = await request(app)
        .get("/users/1")
        .set("Authorization", "Bearer token_invalido");
      
      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token inválido ou expirado/i);
    });

    test("Deve buscar usuário pelo ID", async () => {
      const res = await request(app)
        .get(`/users/${usersAnyTest[0].id}`)
        .set("Authorization", `Bearer ${userAdminTest.token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id", usersAnyTest[0].id);
      expect(res.body.data).toHaveProperty("email");
    });

    test("Deve retornar erro ao tentar buscar usuário inexistente", async () => {
      const res = await request(app)
        .get("/users/99999")
        .set("Authorization", `Bearer ${userAdminTest.token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Usuário não encontrado/i);
    });
  });

  describe("Edição de usuários", () => {
    test("Deve retornar erro ao tentar atualizar usuário sem token", async () => {
      const res = await request(app)
        .put(`/users/${usersAnyTest[0].id}`)
        .send({ name: "Nome Atualizado" });
      
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token não fornecido/i);
    });

    test("Deve retornar erro ao tentar atualizar usuário com token inválido", async () => {
      const res = await request(app)
        .put(`/users/${usersAnyTest[0].id}`)
        .set("Authorization", "Bearer token_invalido")
        .send({ name: "Nome Atualizado" });
      
      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token inválido ou expirado/i);
    });

    test("Deve retornar erro ao tentar atualizar usuário inexistente", async () => {
      const res = await request(app)
        .put("/users/99999")
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({ name: "Nome Atualizado" });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Usuário não encontrado/i);
    });

    test("Deve retornar erro ao tentar atualizar para e-mail já existente", async () => {
      const res = await request(app)
        .put(`/users/${usersAnyTest[0].id}`)
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({ email: userAdminTest.email });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/já está cadastrado/i);
    });

    test("Deve retornar erro ao tentar atualizar para nome de usuário já existente", async () => {
      const res = await request(app)
        .put(`/users/${usersAnyTest[0].id}`)
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({ username: userAdminTest.username });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/já está em uso/i);
    });

    test("Deve retornar erro ao tentar atualizar senha com valor da senha atual incorreto", async () => {
      const res = await request(app)
        .put(`/users/${usersAnyTest[0].id}`)
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({ currentPassword: "SenhaErrada@123", newPassword: "NovaSenha@1234" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Senha atual incorreta/i);
    });

    test("Deve retornar erro ao informar a função inválida na atualização", async () => {
      const res = await request(app)
        .put(`/users/${usersAnyTest[0].id}`)
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({ role: "superadmin" });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Valor de função inválido/i);
    });

    test("Deve atualizar o usuário existente", async () => {
      const res = await request(app)
        .put(`/users/${usersAnyTest[0].id}`)
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({ name: "Usuário Atualizado" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("Usuário Atualizado");
    });
  });

  describe("Remoção de usuários", () => {
    test("Deve retornar erro ao tentar excluir usuário sem token", async () => {
      const res = await request(app).delete(`/users/${usersAnyTest[0].id}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token não fornecido/i);
    });

    test("Deve retornar erro ao tentar excluir usuário com token inválido", async () => {
      const res = await request(app)
        .delete(`/users/${usersAnyTest[0].id}`)
        .set("Authorization", "Bearer token_invalido");

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token inválido ou expirado/i);
    });

    test("Deve retornar erro ao tentar excluir usuário com token de usuário comum", async () => {
      const res = await request(app)
        .delete(`/users/${usersAnyTest[0].id}`)
        .set("Authorization", `Bearer ${usersAnyTest[0].token}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Acesso negado/i);
    });

    test("Deve excluir o usuário criado com token de administrador", async () => {
      const res = await request(app)
        .delete(`/users/${usersAnyTest[0].id}`)
        .set("Authorization", `Bearer ${userAdminTest.token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/removido com sucesso/i);
    });

    test("Deve retornar erro ao tentar excluir usuário inexistente", async () => {
      const res = await request(app)
        .delete("/users/99999")
        .set("Authorization", `Bearer ${userAdminTest.token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Usuário não encontrado/i);
    });
  });
});
