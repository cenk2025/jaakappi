import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
    if (!apiKey) {
        console.error("GEMINI_API_KEY puuttuu ympäristömuuttujista.");
        return NextResponse.json({ error: "Palvelimen konfiguraatiovirhe: API-avain puuttuu." }, { status: 500 });
    }
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "Kuva puuttuu" }, { status: 400 });
        }

        // Extract mime type and base64 data
        // Expected format: "data:image/jpeg;base64,/9j/4AAQSw..."
        const matches = image.match(/^data:(.+);base64,(.+)$/);

        let mimeType = "image/jpeg";
        let base64Data = "";

        if (matches && matches.length === 3) {
            mimeType = matches[1];
            base64Data = matches[2];
        } else {
            // Fallback: assume jpeg if no prefix found or just split directly
            base64Data = image.includes(",") ? image.split(",")[1] : image;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = "Analysoi tämä kuva jääkaapista ja luettele kaikki näkyvät ainekset. Palauta vain pilkulla erotettu luettelo aineksista suomeksi. Älä kirjoita mitään muuta.";

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        if (!text) {
            throw new Error("Gemini palautti tyhjän vastauksen");
        }

        const ingredients = text.split(",").map(i => i.trim());

        return NextResponse.json({ ingredients });
    } catch (error: any) {
        console.error("Gemini Error:", error);
        return NextResponse.json({
            error: "Analyysi epäonnistui: " + (error.message || "Tuntematon virhe")
        }, { status: 500 });
    }
}
