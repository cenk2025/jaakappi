import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "API Key missing in environment variables" }, { status: 500 });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        return NextResponse.json({
            keyConfigured: true,
            keyPrefix: apiKey.substring(0, 5) + "...",
            models: data
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
