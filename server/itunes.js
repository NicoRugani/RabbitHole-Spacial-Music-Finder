const SEARCH_URL = "https://itunes.apple.com/search";
const LOOKUP_URL = "https://itunes.apple.com/lookup";

//removes credits and remaster notes from the title

const EXTRAS = /\s*[(\[](?:feat\.|featuring|[^)\]]*remaster)[^)\]]*[)\]]/gi;

function normalizeTitle(title){
    return title.toLowerCase().replace(EXTRAS, "").replace(/\s+/g, " ").trim();
}

function normalizeArtist(arstist){
    return artist.toLowerCase().replace(/\s+/g, " ").trim();
}

async function callItunes(baseUrl, params){
    //TODO: same pattern as callLastFM:  
}