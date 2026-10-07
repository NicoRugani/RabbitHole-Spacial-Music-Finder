//Turns Last.fm candidates into three real iTunes songs for the graph

import { findSong, songKey } from './itunes.js';

const FINALIST_LIMIT = 8;
const WANTED = 3;

//Step 4 ranks by direction. Last.fm already returns best match first.
export function rankCandidates(source, candidates, direction){
    return candidates;
}

export async function getRecommendations(source, candidates, { direction = "closest", exclude = [] } = {}){
    const excludedIds = new Set(exclude.map(song => song.id));
    const excludedKeys = new Set(exclude.map(song => songKey(song.artist, song.title)));
    excludedKeys.add(songKey(source.artist, source.title));

    //dropping these before the loop means no iTunes call is spent on them
    const finalists = rankCandidates(source, candidates, direction)
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
