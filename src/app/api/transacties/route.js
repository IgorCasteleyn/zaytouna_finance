// src/app/api/transacties/route.js
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const transacties = await prisma.transacties.findMany();
    return new Response(JSON.stringify(transacties), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { omschrijving, type, bedrag, datum, door, betaald, categorie } =
      body;

    if (!omschrijving || !type || !bedrag || !datum || !door || !categorie) {
      return new Response(
        JSON.stringify({ error: "Vul alle verplichte velden in." }),
        { status: 400 }
      );
    }

    const newTransactie = await prisma.transacties.create({
      data: {
        omschrijving,
        type,
        bedrag: parseFloat(bedrag),
        datum: new Date(datum),
        door,
        betaald,
        categorie,
      },
    });

    return new Response(JSON.stringify(newTransactie), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, omschrijving, type, bedrag, datum, door, betaald, categorie } =
      body;

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
      });
    }

    const bijgewerkteTransactie = await prisma.transacties.update({
      where: { id: parseInt(id) },
      data: {
        omschrijving,
        type,
        bedrag,
        datum: new Date(datum),
        door,
        betaald,
        categorie,
      },
    });

    return new Response(JSON.stringify(bijgewerkteTransactie), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
      });
    }

    await prisma.transacties.delete({
      where: { id: parseInt(id) },
    });

    return new Response(JSON.stringify({ message: "Transactie verwijderd" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
