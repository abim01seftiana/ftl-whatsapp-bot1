import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const text = req.body?.Body?.trim() || "";

    if (!text) {
      return res
        .status(200)
        .send(`<Response><Message>Pesannya kosong nih 😅</Message></Response>`);
    }

    const FLOWISE_WEBHOOK = process.env.FLOWISE_WEBHOOK;
    if (!FLOWISE_WEBHOOK) {
      throw new Error("FLOWISE_WEBHOOK belum diatur di Environment Variables");
    }

    const payload = { question: text };

    const aiResponse = await fetch(FLOWISE_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const aiData = await aiResponse.json();
    const reply =
      aiData.text ||
      aiData.output ||
      aiData.answer ||
      "Maaf, aku belum ngerti maksudnya 😅";

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(`<Response><Message>${reply}</Message></Response>`);
  } catch (err) {
    console.error(err);
    res
      .status(200)
      .send(`<Response><Message>Server error nih 😭 (${err.message})</Message></Response>`);
  }
}
