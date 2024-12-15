import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const academiejaar = searchParams.get("academiejaar");

    if (!academiejaar) {
      return new Response(JSON.stringify({ error: "Academiejaar is required" }), { status: 400 });
    }

    const configuraties = await prisma.configuratie.findMany({
      where: { academiejaar },
    });

    // Je wilt waarschijnlijk de academiejaar van elk record teruggeven.
    const value = configuraties.map(config => config.value);

    return new Response(JSON.stringify(value), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
