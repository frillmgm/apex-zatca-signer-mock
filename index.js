import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json({ limit: "5mb" }));

// توقيع وهمي: يرجّع نفس الـ XML (للاختبار فقط)
app.post("/sign", (req, res) => {
  const xml = req.body?.xml;
  if (!xml) return res.status(400).json({ error: "xml is required" });

  // لو تبغى تحمي الخدمة بتوكِن بسيط
  const token = process.env.SIGN_TOKEN;
  const auth = req.get("Authorization");
  if (token && auth !== `Bearer ${token}`) {
    return res.status(401).json({ error: "unauthorized" });
  }

  return res.json({ signed_xml: xml });
});

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`signer mock up on :${PORT}`));
