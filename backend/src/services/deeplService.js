import dotenv from "dotenv";
import * as deepl from "deepl-node";

dotenv.config();

const API_KEY = process.env.DEEPL_API_KEY;

if (!API_KEY) {
  throw new Error("Variável DEEPL_API_KEY não definida.");
}

export const deeplClient = new deepl.DeepLClient(API_KEY);

export async function translateText(text, sourceLang = "EN", targetLang = "PT-BR") {
  try {
    const result = await deeplClient.translateText(text, sourceLang, targetLang);
    return result.text;
  } catch (err) {
    console.error(`[DeepL] Erro na tradução: ${err.message}`);

    return null;
  }
}
