import express from 'express';
import {songs} from './data/songs.js';
import {getRecommendations} from './recommendations.js';

const app = express();
const PORT = 3001;


app.get("/api/health", (req, res) => {
    res.json({status: "ok"});
});

app.get("/api/songs/:id/recommendations", (req, res) => {


    const sourceId = Number(req.params.id);
    const source = songs.find(song => song.id === sourceId);

    if (!source) {
        return res.status(404).json({ error: "Song not found" });
    }

    const excludeIds = req.query.excludeIds ? req.query.exclude.split(',').map(Number) : [];

    res.json({recommendations: getRecommendations(source, songs, excludeIds)});
});

app.listen(PORT, () => {
    console.log(`RabbitHole API listening on http://127.0.0.1:${PORT}`);
})