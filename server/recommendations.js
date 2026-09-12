//Decides how wel a canidate fits the song the user is branching from

/*function scoreSong(source, candidate, excludeIDs){
    return candidates.filter(song =>song.id !== source.id && !excludeIDs.includes(song.id)).slice(0, 3);
}*/

export function getRecommendations(source, candidates, excludeIDs){
    return candidates.filter(song =>song.id !== source.id && !excludeIDs.includes(song.id)).slice(0,3);
}