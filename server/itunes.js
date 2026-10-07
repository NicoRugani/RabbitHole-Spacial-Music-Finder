const SEARCH_URL = "https://itunes.apple.com/search";
const LOOKUP_URL = "https://itunes.apple.com/lookup";

//removes credits and remaster notes from the title

const EXTRAS = /\s*[(\[](?:feat\.|featuring|[^)\]]*remaster)[^)\]]*[)\]]/gi;

function normalizeTitle(title){
    return title.toLowerCase().replace(EXTRAS, "").replace(/\s+/g, " ").trim();
}

function normalizeArtist(artist){
    return artist.toLowerCase().replace(/\s+/g, " ").trim();
}

//one string that means "this recording", so a remaster and its original match
export function songKey(artist, title){
    return `${normalizeArtist(artist)}|${normalizeTitle(title)}`;
}

async function callItunes(baseUrl, params){
    //build url
    const url = new URL(baseUrl);

    for(const [key, value] of Object.entries(params)){
        if(value === undefined) continue;
        url.searchParams.set(key, value);
    }

    
    const response = await fetch(url);
    if(!response.ok){
        throw new Error(`Itunes API request failed: ${response.status}`);
    }
    
    return await response.json();
}

//map iTues names to mine
function toSong(itunesData){
    return {
        id: itunesData.trackId,
        title: itunesData.trackName,
        artist: itunesData.artistName,
        album: itunesData.collectionName,
        genre: itunesData.primaryGenreName,
        year: itunesData.releaseDate ? Number(itunesData.releaseDate.slice(0, 4)) : null,
        artwork: itunesData.artworkUrl100,
        preview: itunesData.previewUrl,
    };
}

export async function lookupSong(trackID){
    //call iTunes with LOOKUP_URL
    const data = await callItunes(LOOKUP_URL, { id: trackID });
    const result = data.results.find(item => item.kind === 'song');
    return result ? toSong(result) : null;

}

//searches iTunes for the version of a song that matches what Last.fm named
export async function findSong(artist, title){
    const data = await callItunes(SEARCH_URL, { term: `${artist} ${title}`, entity: "song", limit: 10 });

    const wantedTitle = normalizeTitle(title);
    const wantedArtist = normalizeArtist(artist);

    const match = (data.results ?? []).find(result => {
        const resultTitle = normalizeTitle(result.trackName);
        const resultArtist = normalizeArtist(result.artistName);

        //an exact title after normalizing rejects live, remix and re-recorded versions
        const titleMatches = resultTitle === wantedTitle;
        //the trailing space keeps "Queen" from matching "Queensryche"
        const artistMatches = resultArtist === wantedArtist || resultArtist.startsWith(`${wantedArtist} `);

        return titleMatches && artistMatches;
    });

    if(!match){
        console.warn("No iTunes match:", artist, "-", title);
        return null;
    }

    return toSong(match);
}
