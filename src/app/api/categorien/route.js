import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const categorien = await prisma.transacties.findMany({
      distinct: ['categorie'],
      select: { categorie: true },
    });

    const value = categorien.map(transactie => transactie.categorie);

    return new Response(JSON.stringify(value), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}