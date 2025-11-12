import { defineConfig } from "cypress";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

const game = {
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
};

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    video: false,
    screenshotOnRunFailure: false,
    supportFile: "cypress/support/e2e.js",
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    setupNodeEvents(on, config) {
      on("task", {
        async createAdminUser() {
          const { data, error } = await supabase
            .from("users")
            .insert([
              {
                name: "Administrador",
                username: "admin",
                email: "admin@example.com",
                password: await bcrypt.hash("AdminPass123!", 10),
                role: "admin",
              },
            ])
            .select()
            .single();

          if (error) {
            throw new Error(error.message);
          }

          return data;
        },
        async createAnyUser() {
          const { data, error } = await supabase
            .from("users")
            .insert([
              {
                name: "João Pedro",
                username: "joaopedro",
                email: "joaopedro@example.com",
                password: await bcrypt.hash("UserPass123!", 10),
                role: "user",
              },
            ])
            .select()
            .single();

          if (error) {
            throw new Error(error.message);
          }

          return data;
        },
        async createGame() {
          const { data, error } = await supabase
            .from("games")
            .insert([game])
            .select()
            .single();

          if (error) {
            throw new Error(error.message);
          }

          return data;
        },
        async cleanDatabase() {
          await supabase.from("users").delete().neq("id", 0);
          await supabase.from("games").delete().neq("id", 0);
          await supabase.from("lists").delete().neq("id", 0);

          return null;
        },
      });
    },
  },
});
