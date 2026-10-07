//Turns Last.fm candidates into three real iTunes songs for the graph

import { findSong, songKey, normalizeArtist } from './itunes.js';

const FINALIST_LIMIT = 8;
const WANTED = 3;

export const DIRECTIONS = { 
    closest: {label: "Closest match", description: "Most similar to this song", match: 1, obscurity: 0, artistRepeat:0},
    branchOut: {label:"Branch Out", description: "Get away from the current song and explore something different.", match: 0.6,obscurity: 0.2,artistRepeat:1},
    deeperDive: {label:"Deeper Dive", description: "Dive deeper into the current song's style and discover more similar tracks.", match: 0.4, obscurity: 1, artistRepeat:0.2}
}

export async function getRecommendations(source, candidates, { direction = "closest", exclude = [] } = {}){
    const graphArtists = new Set(exclude.map(song => normalizeArtist(song.artist)));
    exclude.forEach(song => normalizeArtist(song.artist));
    const excludedIds = new Set(exclude.map(song => song.id));
    const excludedKeys = new Set(exclude.map(song => songKey(song.artist, song.title)));
    excludedKeys.add(songKey(source.artist, source.title));

    //dropping these before the loop means no iTunes call is spent on them
    const finalists = rankCandidates(source, candidates, direction, graphArtists)
        .filter(candidate => !excludedKeys.has(songKey(candidate.artist, candidate.title)))
        .slice(0, FINALIST_LIMIT);

    const chosen = [];

    //one iTunes call at a time, stopping as soon as three are found
    for(const candidate of finalists){
        if(chosen.length === WANTED) break;

        const song = await findSong(candidate.artist, candidate.title);

        if(!song) continue;
        if(excludedIds.has(song.id)) continue;
        if(excludedKeys.has(songKey(song.artist, song.title))) continue;
        if(chosen.some(picked => picked.id === song.id)) continue;

        chosen.push(song);
    }

    return chosen;
}

function popularity(playcount){
    if(!playcount || playcount <= 0) return 0;
    const scale = (Math.log10(playcount)-4) / 4; // scale playcount on a scale of 0-1
    return Math.min(1, Math.max(0, scale));
}

function scoreCandidate(candidate, weights, sourceArtist, graphArtists){
    const artsit = normalizeArtist(candidate.artist);
    const repeats = artsit === sourceArtist || graphArtists.has(artsit) ? 1 : 0;

    const totalScore = (weights.match * (candidate.match || 0)) 
                     + (weights.obscurity * (candidate.obscurity || 0)) 
                     + (weights.artistRepeat * repeats);
    return totalScore;
}

export function rankCandidates(source, candidates, direction, graphArtists){
    const weights = DIRECTIONS[direction] ?? DIRECTIONS.closest;
    const sourceArtist = normalize(source.artists);

    //map each candidate to {candidate, score}
    const scoredCandidates = candidates.map(candidate => ({
        candidate,
        score: scoreCandidate(candidate, weights, sourceArtist, graphArtists)
    }));
    return scoredCandidates.sort((a, b) => b.score - a.score).map(entry => entry.candidate);
}
