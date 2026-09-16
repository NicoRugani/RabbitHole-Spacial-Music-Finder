const API_ROOT = "https://ws.audioscrobbler.com/2.0/";

//calls any last.fm method with the given parameters and returns the response as JSON
async function callLastfm(method, params){
    const url = new URL(API_ROOT);
    url.searchParams.set("method", method);
    url.searchParams.set("api_key", process.env.LAST_FM_API_KEY);
    url.searchParams.set("format", "json");

    //copy every entry of params into url.searchParams
    for(const [name, value] of Object.entries(params)){
        if(value === undefined) continue;
        url.searchParams.set(name, value);
    }

    const response = await fetch(url);
    if(!response.ok){
        throw new Error(`Last.fm API request failed: ${response.status}`);
    }

    const data = await response.json();

    if(data.error){
        throw new Error(`Last.fm API error: ${data.message}`);
    }
    return data;
}

export async function getSimilarTracks(artist, title, limit = 30){
    const data = await callLastfm("track.getsimilar", {artist, track: title, limit, autocorrect: 1});

    const tracks = data.similartracks?.track ?? [];

    return tracks.map(track => ({
        title: track.name,
        artist: track.artist.name,
        matchScore: parseFloat(track.match),
        playcount: parseInt(track.playcount, 10)
    }))
}