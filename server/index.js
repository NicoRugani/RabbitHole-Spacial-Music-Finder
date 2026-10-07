// index.js: The main entry point for the RabbitHole API

import express from 'express';
import {getRecommendations} from './recommendations.js';
import {getSimilarTracks} from './lastfm.js';
import { lookupSong, findSong } from './itunes.js';

const app = express();
const PORT = 3001;

//lets routes read JSON request bodies as req.body
app.use(express.json());


app.get("/api/health", (req, res) => {
    res.json({status: "ok"});
});

app.get("/api/debug/similar", async (req, res) =>{
    try{
        const tracks = await getSimilarTracks(req.query.artist, req.query.title);
        res.json({count: tracks.length, tracks});
    } catch(error){
        res.status(502).json({error: error.message});
    }
});

app.get("/api/debug/lookup/:id", async (req, res) => {
    try {
        const song = await lookupSong(req.params.id);
        res.json(song);
    } catch(error) {
        res.status(502).json({error: error.message});
    }
});

app.get("/api/debug/find", async (req, res) => {
    try {
        const song = await findSong(req.query.artist, req.query.title);
        res.json(song);
    } catch(error) {
        res.status(502).json({error: error.message});
    }
});

app.get("/api/directions", (req, res) => {
    res.json({
        directions: Object.entries(DIRECTIONS).map(([id, {label, description}])=> ({id, label, description})),
    });
});

app.post("/api/recommendations", async (req, res) => {
    const { sourceId, direction, exclude } = req.body ?? {};

    if(!sourceId){
        return res.status(400).json({ error: "sourceId is required" });
    }

    try{
        const source = await lookupSong(sourceId);
        if(!source){
            return res.status(404).json({ error: "Song not found" });
        }

        const candidates = await getSimilarTracks(source.artist, source.title);
        const recommendations = await getRecommendations(source, candidates, { direction, exclude });

        res.json({ recommendations });
    } catch(error){
        console.error(error);
        res.status(502).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`RabbitHole API listening on http://127.0.0.1:${PORT}`);
})

