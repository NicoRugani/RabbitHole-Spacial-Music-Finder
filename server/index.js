import express from 'express';

const app = express();
const PORT = 3001;

app.get("/api/health", (req, res) => {
    
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`RabbitHole API listening on http://127.0.0.1:${PORT}`);
})