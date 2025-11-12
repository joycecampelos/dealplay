import { validateRequiredFields, validateReleaseDate, validatePassword } from "../../src/utils/validationUtils.js";
import { normalizeFields } from "../../src/utils/normalizationUtils.js";

describe("Testando funções utilitárias", () => {
  describe("Função validateRequiredFields", () => {
    it("Deve analisar e não apresentar erro se todos os campos obrigatórios estiverem presentes", () => {
      const obj = { title: "Jogo A", slug: "jogo-a" };
      expect(() => validateRequiredFields(obj, ["title", "slug"])).not.toThrow();
    });

    it("Deve apresentar erro se algum campo obrigatório estiver ausente", () => {
      const obj = { title: "Jogo A" };
      expect(() => validateRequiredFields(obj, ["title", "slug"]))
        .toThrow("Campos obrigatórios ausentes: slug");
    });
  });

  describe("Função validateReleaseDate", () => {
    it("Deve analisar e não apresentar erro para uma data válida", () => {
      expect(() => validateReleaseDate("2024-12-31")).not.toThrow();
    });

    it("Deve apresentar erro para uma data inválida", () => {
      expect(() => validateReleaseDate("22-12-31"))
        .toThrow("Data de lançamento inválida. Use o formato AAAA-MM-DD.");
    });

    it("Deve analisar e não apresentar erro se a data for undefined (campo opcional)", () => {
      expect(() => validateReleaseDate(undefined)).not.toThrow();
    });
  });

  describe("Função normalizeFields", () => {
    it("Deve remover espaços extras e manter valores corretos", () => {
      const input = { title: "  Jogo A  ", slug: "  jogo-a " };
      const result = normalizeFields(input);
      expect(result).toEqual({ title: "Jogo A", slug: "jogo-a" });
    });

    it("Deve converter strings vazias em null", () => {
      const input = { title: "  ", slug: "" };
      const result = normalizeFields(input);
      expect(result).toEqual({ title: null, slug: null });
    });

    it("Deve manter valores que não são strings sem alterações", () => {
      const input = { year: 2024, active: true };
      const result = normalizeFields(input);
      expect(result).toEqual({ year: 2024, active: true });
    });

    it("Deve transformar undefined em null", () => {
      const input = { title: undefined, slug: null };
      const result = normalizeFields(input);
      expect(result).toEqual({ title: null, slug: null });
    });
  });

  describe("Função validatePassword", () => {
    it("Deve apresentar erro se a senha não for informada", () => {
      expect(() => validatePassword("")).toThrow("A senha é obrigatória.");
      expect(() => validatePassword(null)).toThrow("A senha é obrigatória.");
      expect(() => validatePassword(undefined)).toThrow("A senha é obrigatória.");
    });

    it("Deve apresentar erro se a senha tiver menos de 8 caracteres", () => {
      expect(() => validatePassword("Ab1!")).toThrow("A senha deve ter no mínimo 8 caracteres.");
    });

    it("Deve apresentar erro se a senha não tiver no mínimo uma letra maiúscula", () => {
      expect(() => validatePassword("senha123!")).toThrow(
        "A senha deve conter pelo menos uma letra maiúscula, um número e um símbolo."
      );
    });

    it("Deve apresentar erro se a senha não tiver no mínimo um número", () => {
      expect(() => validatePassword("Senha!@#")).toThrow(
        "A senha deve conter pelo menos uma letra maiúscula, um número e um símbolo."
      );
    });

    it("Deve apresentar erro se a senha não tiver no mínimo um símbolo", () => {
      expect(() => validatePassword("Senha123")).toThrow(
        "A senha deve conter pelo menos uma letra maiúscula, um número e um símbolo."
      );
    });

    it("Deve analisar e não apresentar erro para uma senha válida", () => {
      expect(() => validatePassword("Senha123!")).not.toThrow();
      expect(() => validatePassword("Abcde1@#")).not.toThrow();
      expect(() => validatePassword("X9#strong")).not.toThrow();
    });
  });
});
