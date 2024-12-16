import supabase from "@/lib/supabase";
import prisma from "@/lib/prisma";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const transactieId = formData.get("transactieId");

  if (!file || !transactieId) {
    return new Response(
      JSON.stringify({ error: "Bestand of transactie ontbreekt" }),
      { status: 400 }
    );
  }

  const fileContent = await file.arrayBuffer();
  const fileName = `uploads/${file.name}`;

  const { data, error } = await supabase.storage
    .from("Zaytouna_Ticketjes")
    .upload(fileName, fileContent, { contentType: file.type });

  if (error) {
    return new Response(JSON.stringify({ error: "Upload mislukt" }), {
      status: 500,
    });
  }

  const publicUrl = supabase.storage
    .from("Zaytouna_Ticketjes")
    .getPublicUrl(data.path).data.publicUrl;

  await prisma.transacties.update({
    where: { id: parseInt(transactieId) },
    data: { fotoUrl: publicUrl },
  });

  return new Response(JSON.stringify({ url: publicUrl }), { status: 200 });
}
