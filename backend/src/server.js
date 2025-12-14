import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from '../config/env.js';

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.get('/api', (req, res) => {
  res.status(200).json({ message: "success" });
});

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../admin/dist")));

  // ✅ SPA fallback (NO regex, NO '*')
  app.use((req, res) => {
    // ignore asset files
    if (req.path.includes('.')) return;

    res.sendFile(
      path.join(__dirname, "../../admin/dist/index.html")
    );
  });
}

app.listen(ENV.PORT, () => {
  console.log("Server is Running Now");
});
