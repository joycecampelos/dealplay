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

let userAnyTest = {
  name: "Maria da Silva",
  username: "mariadasilva",
  email: "maria.silva@example.com",
  password: "SenhaSegura@1234"
};

let gamesTest = [
  {
    title: "Clair Obscur: Expedition 33",
    slug: "clair-obscur-expedition-33",
    type: "game",
    mature: null,
    release_date: "2024-06-09",
    cover_url: "https://assets.isthereanydeal.com/018ffe0d-15a7-7247-bb3c-4e5e1980561f/boxart.jpg?t=1762765520",
    description: "Lidere os membros da Expedition 33 em sua missão de destruir a Paintress para que ela nunca mais possa pintar a morte. Explore um mundo de maravilhas inspirado na França da Belle Époque e enfrente inimigos únicos neste RPG baseado em turnos com mecânica em tempo real.",
    platforms: ["PlayStation 5", "PC (Microsoft Windows)", "Xbox Series X|S"],
    genres: ["Role-playing (RPG)", "Adventure"],
    developers: ["Sandfall Interactive"],
    publishers: ["Kepler Interactive Limited", "Kepler Interactive", "Sandfall Interactive"],
    tags: ["Turn-Based Combat", "Story Rich", "Fantasy", "RPG", "JRPG"],
    id_itad: "018ffe0d-15a7-7247-bb3c-4e5e1980561f",
    id_igdb: 305152,
    appid_steam: null
  },
  {
    title: "Red Dead Redemption 2",
    slug: "red-dead-redemption-2",
    type: "game",
    mature: null,
    release_date: "2018-10-26",
    cover_url: "https://assets.isthereanydeal.com/018d937f-3a3b-7210-bd2d-0d1dfb1d84c0/boxart.jpg?t=1760981447",
    description: "Red Dead Redemption 2 é a história épica do fora da lei Arthur Morgan e da infame gangue Van der Linde, em fuga pela América no início da era moderna.",
    platforms: ["PlayStation 4", "PC (Microsoft Windows)", "Google Stadia", "Xbox One"],
    genres: ["Shooter", "Role-playing (RPG)", "Adventure"],
    developers: ["Rockstar Games"],
    publishers: ["Rockstar Games", "TAKE-TWO INTERACTIVE"],
    tags: ["Open World", "Story Rich", "Western", "Multiplayer", "Adventure"],
    id_itad: "018d937f-3a3b-7210-bd2d-0d1dfb1d84c0",
    id_igdb: 25076,
    appid_steam: null
  }
];

let createdGameId;

beforeAll(async () => {
  await supabase.from("users").delete().neq("id", 0);
  await supabase.from("games").delete().neq("id", 0);

  await supabase.from("users").insert([
    {
      name: userAdminTest.name,
      username: userAdminTest.username,
      email: userAdminTest.email,
      password: await bcrypt.hash(userAdminTest.password, 10),
      role: "admin"
    },
    {
      name: userAnyTest.name,
      username: userAnyTest.username,
      email: userAnyTest.email,
      password: await bcrypt.hash(userAnyTest.password, 10),
      role: "user"
    }
  ]);

  const resAdmin = await request(app).post("/auth/login").send({
    email: userAdminTest.email,
    password: userAdminTest.password
  });
  userAdminTest.token = resAdmin.body.data.token;

  const resAny = await request(app).post("/auth/login").send({
    email: userAnyTest.email,
    password: userAnyTest.password
  });
  userAnyTest.token = resAny.body.data.token;
});

afterAll(async () => {
  await supabase.from("users").delete().neq("id", 0);
  await supabase.from("games").delete().neq("id", 0);
});

describe("CRUD de games - /games", () => {
  describe("Criação de jogos", () => {
    test("Deve retornar erro ao tentar criar jogo sem token", async () => {
      const res = await request(app).post("/games").send(gamesTest[0]);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token não fornecido/i);
    });

    test("Deve retornar erro ao tentar criar jogo com token inválido", async () => {
      const res = await request(app)
        .post("/games")
        .set("Authorization", "Bearer tokenInvalido")
        .send(gamesTest[0]);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token inválido ou expirado/i);
    });

    test("Deve retornar erro se os campos obrigatórios estiverem ausentes", async () => {
      const res = await request(app)
        .post("/games")
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({
          title: "Jogo Incompleto"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Campos obrigatórios ausentes/i);
    });

    test("Deve retornar erro se o formato da data de lançamento for inválido", async () => {
      const res = await request(app)
        .post("/games")
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({
          title: "Jogo Data Inválida",
          slug: "jogo-data-invalida",
          release_date: "31-12-2024"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Data de lançamento inválida/i);
    });

    test("Deve criar jogo com dados válidos e token de administrador", async () => {
      const res = await request(app)
        .post("/games")
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send(gamesTest[0]);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.title).toBe(gamesTest[0].title);
      createdGameId = res.body.data.id;
    });

    test("Deve criar jogo com dados válidos e token de usuário comum", async () => {
      const res = await request(app)
        .post("/games")
        .set("Authorization", `Bearer ${userAnyTest.token}`)
        .send(gamesTest[1]);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.title).toBe(gamesTest[1].title);
    });

    test("Deve retornar erro ao tentar criar jogo duplicado", async () => {
      const res = await request(app)
        .post("/games")
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send(gamesTest[0]);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/duplicate key value violates unique constraint/i);
    });
  });

  describe("Listagem de jogos", () => {
    test("Deve retornar erro ao tentar listar jogos sem token", async () => {
      const res = await request(app).get("/games");

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token não fornecido/i);
    });

    test("Deve retornar erro ao tentar listar jogos com token inválido", async () => {
      const res = await request(app)
        .get("/games")
        .set("Authorization", "Bearer tokenInvalido");

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token inválido ou expirado/i);
    });

    test("Deve retornar erro ao tentar listar jogos com token de usuário comum", async () => {
      const res = await request(app)
        .get("/games")
        .set("Authorization", `Bearer ${userAnyTest.token}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Acesso negado/i);
    });

    test("Deve listar todos os jogos com token de administrador", async () => {
      const res = await request(app)
        .get("/games")
        .set("Authorization", `Bearer ${userAdminTest.token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Busca de jogos", () => {
    describe("Busca por ID", () => {
      test("Deve retornar erro ao tentar buscar jogo sem token", async () => {
        const res = await request(app).get(`/games/${createdGameId}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Token não fornecido/i);
      });

      test("Deve retornar erro ao tentar buscar jogo com token inválido", async () => {
        const res = await request(app)
          .get(`/games/${createdGameId}`)
          .set("Authorization", "Bearer tokenInvalido");

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Token inválido ou expirado/i);
      });

      test("Deve retornar erro ao tentar buscar jogo com token de usuário comum", async () => {
        const res = await request(app)
          .get(`/games/${createdGameId}`)
          .set("Authorization", `Bearer ${userAnyTest.token}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Acesso negado/i);
      });

      test("Deve buscar jogo pelo ID com token de administrador", async () => {
        const res = await request(app)
          .get(`/games/${createdGameId}`)
          .set("Authorization", `Bearer ${userAdminTest.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("id", createdGameId);
      });

      test("Deve retornar erro ao buscar jogo inexistente", async () => {
        const res = await request(app)
          .get("/games/99999")
          .set("Authorization", `Bearer ${userAdminTest.token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Jogo não encontrado/i);
      });
    });

    describe("Busca por ID Itad", () => {
      test("Deve retornar erro ao tentar buscar jogo sem token", async () => {
        const res = await request(app).get(`/games/itad/${gamesTest[0].id_itad}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Token não fornecido/i);
      });

      test("Deve retornar erro ao tentar buscar jogo com token inválido", async () => {
        const res = await request(app)
          .get(`/games/itad/${gamesTest[0].id_itad}`)
          .set("Authorization", "Bearer tokenInvalido");

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Token inválido ou expirado/i);
      });

      test("Deve buscar jogo pelo ID Itad com token de usuário comum", async () => {
        const res = await request(app)
          .get(`/games/itad/${gamesTest[0].id_itad}`)
          .set("Authorization", `Bearer ${userAnyTest.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data[0]).toHaveProperty("id_itad", gamesTest[0].id_itad);
      });

      test("Deve buscar jogo pelo ID Itad com token de administrador", async () => {
        const res = await request(app)
          .get(`/games/itad/${gamesTest[0].id_itad}`)
          .set("Authorization", `Bearer ${userAdminTest.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data[0]).toHaveProperty("id_itad", gamesTest[0].id_itad);
      });
    });
  });

  describe("Edição de jogos", () => {
    test("Deve retornar erro ao tentar atualizar jogo sem token", async () => {
      const res = await request(app)
        .put(`/games/${createdGameId}`)
        .send({ title: "Alteração sem token" });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token não fornecido/i);
    });

    test("Deve retornar erro ao tentar atualizar jogo com token inválido", async () => {
      const res = await request(app)
        .put(`/games/${createdGameId}`)
        .set("Authorization", "Bearer tokenInvalido")
        .send({ title: "Alteração com token inválido" });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token inválido ou expirado/i);
    });

    test("Deve retornar erro ao tentar atualizar jogo com token de usuário comum", async () => {
      const res = await request(app)
        .put(`/games/${createdGameId}`)
        .set("Authorization", `Bearer ${userAnyTest.token}`)
        .send({ title: "Alteração com token de usuário comum" });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Acesso negado/i);
    });

    test("Deve atualizar o jogo existente com token de administrador", async () => {
      const res = await request(app)
        .put(`/games/${createdGameId}`)
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({
          title: "The Witcher 3 - Edição Completa"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("The Witcher 3 - Edição Completa");
    });

    test("Deve retornar erro ao tentar atualizar jogo inexistente", async () => {
      const res = await request(app)
        .put("/games/99999")
        .set("Authorization", `Bearer ${userAdminTest.token}`)
        .send({ title: "Jogo Inexistente" });
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Jogo não encontrado/i);
    });
  });

  describe("Remoção de jogos", () => {
    test("Deve retornar erro ao tentar excluir jogo sem token", async () => {
      const res = await request(app).delete(`/games/${createdGameId}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token não fornecido/i);
    });

    test("Deve retornar erro ao tentar excluir jogo com token inválido", async () => {
      const res = await request(app)
        .delete(`/games/${createdGameId}`)
        .set("Authorization", "Bearer tokenInvalido");

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token inválido ou expirado/i);
    });

    test("Deve retornar erro ao tentar excluir jogo com token de usuário comum", async () => {
      const res = await request(app)
        .delete(`/games/${createdGameId}`)
        .set("Authorization", `Bearer ${userAnyTest.token}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Acesso negado/i);
    });

    test("Deve excluir o jogo criado com token de administrador", async () => {
      const res = await request(app)
        .delete(`/games/${createdGameId}`)
        .set("Authorization", `Bearer ${userAdminTest.token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/Jogo removido com sucesso/i);
      expect(res.body.data).toHaveProperty("id", createdGameId);
    });

    test("Deve retornar erro ao tentar excluir jogo inexistente", async () => {
      const res = await request(app)
        .delete(`/games/${createdGameId}`)
        .set("Authorization", `Bearer ${userAdminTest.token}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Jogo não encontrado/i);
    });
  });
});
