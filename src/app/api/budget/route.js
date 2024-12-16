import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    // Haal het meest recente academiejaar op
    const huidigeConfiguratie = await prisma.configuratie.findFirst({
      orderBy: { id: "desc" },
    });

    if (!huidigeConfiguratie) {
      return new Response(
        JSON.stringify({ error: "Geen configuratie gevonden." }),
        { status: 404 }
      );
    }

    // Bereken de som van alle transacties
    const transacties = await prisma.transacties.aggregate({
      _sum: { bedrag: true },
    });

    // Bereken huidig bedrag
    const beginBedrag = huidigeConfiguratie.value || 0;
    const transactiesSom = transacties._sum.bedrag || 0;
    const huidigBedrag = beginBedrag + transactiesSom;

    return new Response(
      JSON.stringify({
        beginBedrag,
        transactiesSom,
        huidigBedrag,
        academiejaar: huidigeConfiguratie.academiejaar,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Fout bij het berekenen van budget:", error);
    return new Response(
      JSON.stringify({ error: "Er ging iets mis bij het ophalen van budget." }),
      { status: 500 }
    );
  }
}
