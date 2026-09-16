// index.js: The main entry point for the RabbitHole API

import express from 'express';
import {songs} from './data/songs.js';
import {getRecommendations} from './recommendations.js';
import {getSimilarTracks} from './lastfm.js';

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

    const excludeIds = req.query.exclude ? req.query.exclude.split(',').map(Number) : [];

    res.json({recommendations: getRecommendations(source, songs, excludeIds)});
});

app.get("/api/debug/similar", async (req, res) =>{
    try{
        const tracks = await getSimilarTracks(req.query.artist, req.query.title);
        res.json({count: tracks.length, tracks});
    } catch(error){
        res.status(502).json({error: error.message});
    }
});

app.listen(PORT, () => {
    console.log(`RabbitHole API listening on http://127.0.0.1:${PORT}`);
})

