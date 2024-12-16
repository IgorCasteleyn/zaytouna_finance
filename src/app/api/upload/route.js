import supabase from "@/lib/supabase";
import prisma from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    console.log('API call started'); // Log voor debuggen
    
    // 1. Verwerk de form data
    const formData = await req.formData();
    const file = formData.get("file");
    const transactieId = formData.get("transactieId");

    console.log('Form data:', { file, transactieId }); // Log de ontvangen form data

    // 2. Controleer of file en transactieId aanwezig zijn
    if (!file || !transactieId) {
      console.error('Bestand of transactie ontbreekt'); // Log fout
      return new Response(
        JSON.stringify({ error: "Bestand of transactie ontbreekt" }),
        { status: 400 }
      );
    }

    // 3. Haal de bestand data op
    const fileContent = await file.arrayBuffer();
    const fileName = `uploads/KT_${file.name}`; // Dynamische naam met prefix KT_
    console.log('File Name:', fileName); // Log de naam van het bestand

    // 4. Upload bestand naar Supabase
    const { data, error: uploadError } = await supabase.storage
      .from("Zaytouna_Ticketjes")
      .upload(fileName, fileContent, { contentType: file.type });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError); // Log uploadfout
      return new Response(
        JSON.stringify({ error: `Fout bij uploaden naar Supabase: ${uploadError.message}` }),
        { status: 500 }
      );
    }

    // 5. Verkrijg de publieke URL van het bestand
    const publicUrl = supabase.storage
      .from("Zaytouna_Ticketjes")
      .getPublicUrl(data.path).data.publicUrl;

    console.log('Public URL:', publicUrl); // Log de publieke URL van het bestand

    // 6. Update transactie met de foto URL in de database
    try {
      await prisma.transacties.update({
        where: { id: parseInt(transactieId) },
        data: { fotoUrl: publicUrl },
      });
      console.log('Database updated successfully'); // Log succes bij database update
    } catch (dbError) {
      console.error('Database error:', dbError); // Log databasefout
      return new Response(
        JSON.stringify({ error: `Fout bij het updaten van de transactie in de database: ${dbError.message}` }),
        { status: 500 }
      );
    }

    // 7. Retourneer het resultaat
    return new Response(JSON.stringify({ url: publicUrl }), { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err); // Log onverwachte fout
    return new Response(
      JSON.stringify({ error: `Er is een fout opgetreden: ${err.message}` }),
      { status: 500 }
    );
  }
}
