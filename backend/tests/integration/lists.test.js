import bcrypt from "bcrypt";
import request from "supertest";
import app from "../../server.js";
import supabase from "../../src/config/supabaseConfig.js";

let userData;
let gameData;
let playLogsTest;
let createdPlayLogId;

beforeAll(async () => {
  await supabase.from("users").delete().neq("id", 0);
  await supabase.from("games").delete().neq("id", 0);
  await supabase.from("lists").delete().neq("id", 0);

  userData = await supabase
    .from("users")
    .insert([
      {
        name: "Maria da Silva",
        username: "mariadasilva",
        email: "maria.silva@example.com",
        password: await bcrypt.hash("SenhaSegura@1234", 10),
        role: "user"
      }
    ])
    .select("id, email");

  gameData = await supabase
    .from("games")
    .insert([
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
      }
    ])
    .select("id, id_itad");

  userData = userData.data[0];
  gameData = gameData.data[0];
  console.log(gameData);

  const resAny = await request(app).post("/auth/login").send({
    email: userData.email,
    password: "SenhaSegura@1234"
  });
  userData.token = resAny.body.data.token;

  playLogsTest = {
    user_id: userData.id,
    game_id: gameData.id,
    status: "jogando",
    progress: 10,
    rating: 4,
    review: "Ótimo jogo, estou adorando a história e os gráficos!",
    notes: "Jogar nas horas vagas."
  };
});

afterAll(async () => {
  await supabase.from("users").delete().neq("id", 0);
  await supabase.from("games").delete().neq("id", 0);
  await supabase.from("lists").delete().neq("id", 0);
});

describe("CRUD de PlayLogs - /lists", () => {
  describe("Criação de PlayLogs", () => {
    test("Deve retornar erro ao tentar criar PlayLog sem token", async () => {
      const res = await request(app).post("/lists").send(playLogsTest);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token não fornecido/i);
    });

    test("Deve retornar erro ao tentar criar PlayLog com token inválido", async () => {
      const res = await request(app)
        .post("/lists")
        .set("Authorization", `Bearer token_invalido`)
        .send(playLogsTest);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token inválido ou expirado/i);
    });

    test("Deve retornar erro se os campos obrigatórios estiverem ausentes", async () => {
      const res = await request(app)
        .post("/lists")
        .set("Authorization", `Bearer ${userData.token}`)
        .send({
          game_id: playLogsTest.game_id,
          status: playLogsTest.status
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Campos obrigatórios ausentes/i);
    });

    test("Deve retornar erro se o ID do jogo for inválido", async () => {
      const res = await request(app)
        .post("/lists")
        .set("Authorization", `Bearer ${userData.token}`)
        .send({
          user_id: playLogsTest.user_id,
          game_id: 99999,
          status: playLogsTest.status
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Jogo não encontrado/i);
    });

    test("Deve criar PlayLog com dados válidos", async () => {
      const res = await request(app)
        .post("/lists")
        .set("Authorization", `Bearer ${userData.token}`)
        .send(playLogsTest);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.user_id).toBe(playLogsTest.user_id);
      expect(res.body.data.game_id).toBe(playLogsTest.game_id);
      createdPlayLogId = res.body.data.id;
    });

    test("Deve retornar erro ao tentar adicionar o mesmo jogo duas vezes para o mesmo usuário", async () => {
      const res = await request(app)
        .post("/lists")
        .set("Authorization", `Bearer ${userData.token}`)
        .send(playLogsTest);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/já está na lista/);
    });
  });

  describe("Listagem de PlayLogs", () => {
    test("Deve retornar erro ao tentar listar PlayLogs sem token", async () => {
      const res = await request(app).get("/lists");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token não fornecido/i);
    });

    test("Deve retornar erro ao tentar listar PlayLogs com token inválido", async () => {
      const res = await request(app)
        .get("/lists")
        .set("Authorization", `Bearer token_invalido`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token inválido ou expirado/i);
    });

    test("Deve listar apenas os PlayLogs do usuário logado", async () => {
      const res = await request(app)
        .get("/lists")
        .set("Authorization", `Bearer ${userData.token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0]).toHaveProperty("id", createdPlayLogId);
    });
  });

  describe("Busca de PlayLogs", () => {
    describe("Busca por ID", () => {
      test("Deve retornar erro ao tentar buscar PlayLog por ID sem token", async () => {
        const res = await request(app).get(`/lists/${createdPlayLogId}`);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Token não fornecido/i);
      });

      test("Deve retornar erro ao tentar buscar PlayLog por ID com token inválido", async () => {
        const res = await request(app)
          .get(`/lists/${createdPlayLogId}`)
          .set("Authorization", `Bearer token_invalido`);

        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Token inválido ou expirado/i);
      });

      test("Deve buscar PlayLog pelo ID", async () => {
        const res = await request(app)
          .get(`/lists/${createdPlayLogId}`)
          .set("Authorization", `Bearer ${userData.token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("id", createdPlayLogId);
      });
    });

    describe("Busca por ID do jogo", () => {
      test("Deve retornar erro ao tentar buscar PlayLogs por ID do jogo sem token", async () => {
        const res = await request(app).get(`/lists/game/${gameData.id}`);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Token não fornecido/i);
      });

      test("Deve retornar erro ao tentar buscar PlayLogs por ID do jogo com token inválido", async () => {
        const res = await request(app)
          .get(`/lists/game/${gameData.id}`)
          .set("Authorization", `Bearer token_invalido`);
        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Token inválido ou expirado/i);
      });

      test("Deve buscar PlayLogs pelo ID do jogo", async () => {
        const res = await request(app)
          .get(`/lists/game/${gameData.id}`)
          .set("Authorization", `Bearer ${userData.token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0]).toHaveProperty("id", createdPlayLogId);
      });
    });

    describe("Busca por ID do usuário e ID ITAD do jogo", () => {
      test("Deve retornar erro ao tentar buscar PlayLog por ID do usuário e ID ITAD do jogo sem token", async () => {
        const res = await request(app).get(`/lists/user/${userData.id}/game/${gameData.id_itad}`);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Token não fornecido/i);
      });

      test("Deve retornar erro ao tentar buscar PlayLog por ID do usuário e ID ITAD do jogo com token inválido", async () => {
        const res = await request(app)
          .get(`/lists/user/${userData.id}/game/${gameData.id_itad}`)
          .set("Authorization", `Bearer token_invalido`);

        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Token inválido ou expirado/i);
      });

      test("Deve buscar PlayLog pelo ID do usuário e ID ITAD do jogo", async () => {
        const res = await request(app)
          .get(`/lists/user/${userData.id}/game/${gameData.id_itad}`)
          .set("Authorization", `Bearer ${userData.token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0]).toHaveProperty("id", createdPlayLogId);
      });
    });
  });

  describe("Edição de PlayLogs", () => {
    test("Deve retornar erro ao tentar editar PlayLog sem token", async () => {
      const res = await request(app)
        .put(`/lists/${createdPlayLogId}`)
        .send({ status: "finalizado", progress: 100 });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token não fornecido/i);
    });

    test("Deve retornar erro ao tentar editar PlayLog com token inválido", async () => {
      const res = await request(app)
        .put(`/lists/${createdPlayLogId}`)
        .set("Authorization", `Bearer token_invalido`)
        .send({ status: "finalizado", progress: 100 });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token inválido ou expirado/i);
    });

    test("Deve retornar erro ao tentar editar PlayLog de outro usuário", async () => {
      const resUser = await supabase.from("users").insert([
        {
          name: "Ana Costa",
          username: "anacosta",
          email: "anacosta@example.com",
          password: await bcrypt.hash("SenhaSecreta@1234", 10),
          role: "user"
        }
      ]).select("id");

      const resPlayLog = await supabase.from("lists").insert([
        {
          user_id: resUser.data[0].id,
          game_id: gameData.id,
          status: "jogando",
          progress: 50
        }
      ]).select("id");

      const res = await request(app)
        .put(`/lists/${resPlayLog.data[0].id}`)
        .set("Authorization", `Bearer ${userData.token}`)
        .send({ status: "finalizado", progress: 100 });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Acesso negado/i);
    });

    test("Deve atualizar PlayLog criado pelo usuário", async () => {
      const res = await request(app)
        .put(`/lists/${createdPlayLogId}`)
        .set("Authorization", `Bearer ${userData.token}`)
        .send({ status: "finalizado", progress: 100 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id", createdPlayLogId);
      expect(res.body.data.status).toBe("finalizado");
      expect(res.body.data.progress).toBe(100);
    });

    test("Deve retornar erro ao tentar atualizar PlayLog inexistente", async () => {
      const res = await request(app)
        .put("/lists/99999")
        .set("Authorization", `Bearer ${userData.token}`)
        .send({ status: "abandonado" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Entrada não encontrada/i);
    });
  });

  describe("Remoção de PlayLogs", () => {
    test("Deve retornar erro ao tentar excluir PlayLog sem token", async () => {
      const res = await request(app).delete(`/lists/${createdPlayLogId}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token não fornecido/i);
    });

    test("Deve retornar erro ao tentar excluir PlayLog com token inválido", async () => {
      const res = await request(app)
        .delete(`/lists/${createdPlayLogId}`)
        .set("Authorization", `Bearer token_invalido`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Token inválido ou expirado/i);
    });

    test("Deve retornar erro ao tentar excluir PlayLog de outro usuário", async () => {
      const resUser = await supabase.from("users").insert([
        {
          name: "João Pereira",
          username: "joaopereira",
          email: "joaopereira@example.com",
          password: await bcrypt.hash("SenhaSecreta@1234", 10),
          role: "user"
        }
      ]).select("id");

      const resPlayLog = await supabase.from("lists").insert([
        {
          user_id: resUser.data[0].id,
          game_id: gameData.id,
          status: "jogando",
          progress: 50
        }
      ]).select("id");

      const res = await request(app)
        .delete(`/lists/${resPlayLog.data[0].id}`)
        .set("Authorization", `Bearer ${userData.token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Acesso negado/i);
    });

    test("Deve excluir PlayLog criado pelo usuário", async () => {
      const res = await request(app)
        .delete(`/lists/${createdPlayLogId}`)
        .set("Authorization", `Bearer ${userData.token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/removida com sucesso/i);
      expect(res.body.data).toHaveProperty("id", createdPlayLogId);
    });

    test("Deve retornar erro ao tentar excluir PlayLog inexistente", async () => {
      const res = await request(app)
        .delete(`/lists/${createdPlayLogId}`)
        .set("Authorization", `Bearer ${userData.token}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Entrada não encontrada/i);
    });
  });
});
