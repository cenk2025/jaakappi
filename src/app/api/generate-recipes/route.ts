import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { ingredients, diets } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
      Toimi ammattikokkina. Luettele 3 suomeksi olevaa reseptiä käyttäen näitä aineksia: ${ingredients.join(", ")}.
      Huomioi nämä ruokavaliot: ${diets.join(", ")}.
      
      Palauta JSON-muodossa taulukko olioita, joilla on seuraavat kentät:
      - id: uniikki merkkijono
      - title: reseptin nimi
      - prepTime: valmistusaika (esim. "20 min")
      - calories: arvioidut kalorit (numero)
      - difficulty: Helppo, Keskitaso tai Vaikea
      - dietTags: taulukko ruokavaliotunnisteista (esim. ["KETO", "VEGAANI"])
      - image_prompt: kuvaus reseptistä kuvan generointia varten (englanniksi)
      - ingredients: taulukko olioita { name: string, amount: string, status: "instock" | "missing" }
      - steps: taulukko olioita { title: string, instruction: string, ingredients: string[] }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const recipes = JSON.parse(response.text());

        return NextResponse.json({ recipes });
    } catch (error) {
        console.error("Gemini Error:", error);
        return NextResponse.json({ error: "Reseptien generointi epäonnistui" }, { status: 500 });
    }
}
