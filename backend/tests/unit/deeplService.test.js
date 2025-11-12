import { jest } from "@jest/globals";
import { translateText, deeplClient } from "../../src/services/deeplService.js";

jest.spyOn(console, "error").mockImplementation(() => { });

describe("Traduzindo textos (translateText - DeepL Service)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("Deve retornar o texto traduzido", async () => {
    jest.spyOn(deeplClient, "translateText").mockResolvedValue({ text: "Olá Mundo" });

    const result = await translateText("Hello World");
    expect(result).toBe("Olá Mundo");
  });

  it("Deve retornar null e apresentar erro no console", async () => {
    jest.spyOn(deeplClient, "translateText").mockRejectedValue(new Error("Falha DeepL"));

    const result = await translateText("Hello");
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      "[DeepL] Erro na tradução: Falha DeepL"
    );
  });
});
