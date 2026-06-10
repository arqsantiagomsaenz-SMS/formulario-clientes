exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const NOTION_TOKEN = process.env.NOTION_TOKEN_CORP;
  const DATABASE_ID = "37befdfe9cbb8084a1cbe6dc2b2e0ef3";

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const richTextBlocks = (data.respuestas || []).map(chunk => ({
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
      return { statusCode: 500, body: "Error al guardar en Notion: " + err };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    return { statusCode: 500, body: "Error de conexión: " + err.message };
  }
};