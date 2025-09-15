const express = require("express");
const bodyParser = require("body-parser");
const { SignedXml } = require("xml-crypto");
const fs = require("fs");

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));

// تحميل الشهادة (PKCS12 أو private.pem) - مبدئيًا نخليها بسيطة
const privateKey = fs.readFileSync("private.pem", "utf8"); // تحتاج تضيف مفتاحك

app.post("/sign", (req, res) => {
  try {
    const xml = req.body.xml;
    if (!xml) return res.status(400).send({ error: "XML required" });

    const sig = new SignedXml();
    sig.addReference("/*");
    sig.signingKey = privateKey;
    sig.computeSignature(xml);

    res.send({ signed_xml: sig.getSignedXml() });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Signing failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Sign service running on port ${port}`));
