import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "Kuva puuttuu" }, { status: 400 });
        }

        // Extract base64 data
        const base64Data = image.split(",")[1];

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Analysoi tämä kuva jääkaapista ja luettele kaikki näkyvät ainekset. Palauta vain pilkulla erotettu luettelo aineksista suomeksi. Älä kirjoita mitään muuta.";

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const ingredients = response.text().split(",").map(i => i.trim());

        return NextResponse.json({ ingredients });
    } catch (error) {
        console.error("Gemini Error:", error);
        return NextResponse.json({ error: "Analyysi epäonnistui" }, { status: 500 });
    }
}
