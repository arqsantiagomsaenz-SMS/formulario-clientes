exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const NOTION_TOKEN = "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";
  const DATABASE_ID = "372efdfe9cbb80afa975fa9f58d7c5c8";

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const props = {
    "Nombre": {
      title: [{ text: { content: data.nombre || "Sin nombre" } }]
    },
    "Email": {
      email: data.email || null
    },
    "Habitantes": {
      rich_text: [{ text: { content: data.habitantes || "" } }]
    },
    "Empleada": {
      rich_text: [{ text: { content: data.empleada || "" } }]
    },
    "Mascotas": {
      rich_text: [{ text: { content: data.mascotas || "" } }]
    },
    "Rutina Mañana": {
      rich_text: [{ text: { content: (data.rutina_manana || "").substring(0, 2000) } }]
    },
    "Rutina Baño": {
      rich_text: [{ text: { content: (data.rutina_bano || "").substring(0, 2000) } }]
    },
    "Productos Baño": {
      rich_text: [{ text: { content: data.productos_bano || "" } }]
    },
    "Baño Compartido": {
      rich_text: [{ text: { content: (data.bano_compartido || "").substring(0, 2000) } }]
    },
    "Vestirse": {
      rich_text: [{ text: { content: (data.vestirse || "").substring(0, 2000) } }]
    },
    "Plancha": {
      rich_text: [{ text: { content: data.plancha || "" } }]
    },
    "Desayuno": {
      rich_text: [{ text: { content: data.desayuno || "" } }]
    },
    "Al Salir": {
      rich_text: [{ text: { content: (data.al_salir || "").substring(0, 2000) } }]
    },
    "Objetos Perdidos": {
      rich_text: [{ text: { content: data.objetos_perdidos || "" } }]
    },
    "Llegada Casa": {
      rich_text: [{ text: { content: (data.llegada_casa || "").substring(0, 2000) } }]
    },
    "Cosas Llegada": {
      rich_text: [{ text: { content: data.cosas_llegada || "" } }]
    },
    "Almuerzo": {
      rich_text: [{ text: { content: data.almuerzo || "" } }]
    },
    "Rutina Almuerzo": {
      rich_text: [{ text: { content: (data.rutina_almuerzo || "").substring(0, 2000) } }]
    },
    "Cocina Frecuencia": {
      rich_text: [{ text: { content: data.cocina_frecuencia || "" } }]
    },
    "Tipo Cocina": {
      rich_text: [{ text: { content: data.tipo_cocina || "" } }]
    },
    "Bebidas": {
      rich_text: [{ text: { content: data.bebidas || "" } }]
    },
    "Electrodomesticos Diarios": {
      rich_text: [{ text: { content: data.electro_diarios || "" } }]
    },
    "Cocina Problemas": {
      rich_text: [{ text: { content: (data.cocina_problemas || "").substring(0, 2000) } }]
    },
    "Tiempo Libre Solo": {
      rich_text: [{ text: { content: data.tiempo_libre || "" } }]
    },
    "Planes Pareja": {
      rich_text: [{ text: { content: data.planes_pareja || "" } }]
    },
    "Visitas Frecuencia": {
      rich_text: [{ text: { content: data.visitas_frecuencia || "" } }]
    },
    "Planes Visitas": {
      rich_text: [{ text: { content: (data.planes_visitas || "").substring(0, 2000) } }]
    },
    "Teletrabajo": {
      rich_text: [{ text: { content: data.teletrabajo || "" } }]
    },
    "Hobbies": {
      rich_text: [{ text: { content: (data.hobbies || "").substring(0, 2000) } }]
    },
    "Ritual Noche": {
      rich_text: [{ text: { content: (data.ritual_noche || "").substring(0, 2000) } }]
    },
    "Uso Habitacion": {
      rich_text: [{ text: { content: data.uso_habitacion || "" } }]
    },
    "Ropa Colgada": {
      rich_text: [{ text: { content: data.ropa_colgada || "" } }]
    },
    "Ropa Doblada": {
      rich_text: [{ text: { content: data.ropa_doblada || "" } }]
    },
    "Zapatos": {
      rich_text: [{ text: { content: data.zapatos || "" } }]
    },
    "Bolsos": {
      rich_text: [{ text: { content: data.bolsos || "" } }]
    },
    "Ropa Especial": {
      rich_text: [{ text: { content: data.ropa_especial || "" } }]
    },
    "Fin de Semana": {
      rich_text: [{ text: { content: (data.fin_semana || "").substring(0, 2000) } }]
    },
    "Deporte": {
      rich_text: [{ text: { content: data.deporte || "" } }]
    },
    "Balcon": {
      rich_text: [{ text: { content: (data.balcon || "").substring(0, 2000) } }]
    },
    "Tecnologia": {
      rich_text: [{ text: { content: data.tecnologia || "" } }]
    },
    "Colecciones": {
      rich_text: [{ text: { content: (data.colecciones || "").substring(0, 2000) } }]
    },
    "Limpieza": {
      rich_text: [{ text: { content: data.limpieza || "" } }]
    },
    "Lavado": {
      rich_text: [{ text: { content: (data.lavado || "").substring(0, 2000) } }]
    },
    "Otros Almacenamiento": {
      rich_text: [{ text: { content: (data.otros_almacenamiento || "").substring(0, 2000) } }]
    },
    "Frustraciones": {
      rich_text: [{ text: { content: (data.frustraciones || "").substring(0, 2000) } }]
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
