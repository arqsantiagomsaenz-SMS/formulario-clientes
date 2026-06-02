exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = "372efdfe9cbb80afa975fa9f58d7c5c8";

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  // Construir texto completo de respuestas
  const respuestas = `
👤 PERFIL DEL HOGAR
Nombre: ${data.nombre || ""}
Email: ${data.email || ""}
Habitantes: ${data.habitantes || ""}
Empleada: ${data.empleada || ""}
Mascotas: ${data.mascotas || ""}

🌅 LA MAÑANA
Despertar: ${data.rutina_manana || ""}
Rutina de baño: ${data.rutina_bano || ""}
Productos baño: ${data.productos_bano || ""}
Baño compartido: ${data.bano_compartido || ""}
Vestirse: ${data.vestirse || ""}
Plancha: ${data.plancha || ""}
Desayuno: ${data.desayuno || ""}
Al salir: ${data.al_salir || ""}
Objetos que busca: ${data.objetos_perdidos || ""}

🏠 LLEGADA Y MEDIODÍA
Llegada a casa: ${data.llegada_casa || ""}
Cosas que trae: ${data.cosas_llegada || ""}
Almuerzo: ${data.almuerzo || ""}
Rutina almuerzo: ${data.rutina_almuerzo || ""}

🍳 COCINA
Frecuencia cocina: ${data.cocina_frecuencia || ""}
Tipo de cocina: ${data.tipo_cocina || ""}
Bebidas: ${data.bebidas || ""}
Electrodomésticos diarios: ${data.electro_diarios || ""}
Problemas cocina: ${data.cocina_problemas || ""}

🧑‍🤝‍🧑 VIDA SOCIAL
Tiempo libre solo: ${data.tiempo_libre || ""}
Planes en pareja: ${data.planes_pareja || ""}
Frecuencia visitas: ${data.visitas_frecuencia || ""}
Planes con visitas: ${data.planes_visitas || ""}

🌙 TARDES Y NOCHES
Tardes en casa: ${data.tardes || ""}
Teletrabajo: ${data.teletrabajo || ""}
Pasatiempos: ${data.hobbies || ""}
Ritual de noche: ${data.ritual_noche || ""}

🛏️ HABITACIÓN Y CLOSET
Uso habitación: ${data.uso_habitacion || ""}
Ropa colgada: ${data.ropa_colgada || ""}
Ropa doblada: ${data.ropa_doblada || ""}
Zapatos: ${data.zapatos || ""}
Bolsos: ${data.bolsos || ""}
Ropa especial: ${data.ropa_especial || ""}

📅 FINES DE SEMANA
Sábado típico: ${data.fin_semana || ""}
Deporte: ${data.deporte || ""}
Balcón/terraza: ${data.balcon || ""}

📦 ALMACENAMIENTO
Tecnología: ${data.tecnologia || ""}
Colecciones: ${data.colecciones || ""}
Limpieza: ${data.limpieza || ""}
Lavado de ropa: ${data.lavado || ""}
Otros elementos: ${data.otros_almacenamiento || ""}

💭 EL HOGAR QUE SUEÑA
Frustraciones y sueños: ${data.frustraciones || ""}
`.trim();

  // Notion limita rich_text a 2000 caracteres por bloque
  // Dividimos en chunks de 2000
  const chunks = [];
  for (let i = 0; i < respuestas.length; i += 1900) {
    chunks.push(respuestas.substring(i, i + 1900));
  }

  const richTextBlocks = chunks.map(chunk => ({
    text: { content: chunk }
  }));

  const props = {
    "Nombre": {
      title: [{ text: { content: data.nombre || "Sin nombre" } }]
    },
    "Respuestas": {
      rich_text: richTextBlocks
    }
  };

  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: props
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Notion error:", err);
      return { statusCode: 500, body: "Error al guardar en Notion: " + err };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    console.error("Fetch error:", err);
    return { statusCode: 500, body: "Error de conexión: " + err.message };
  }
};
