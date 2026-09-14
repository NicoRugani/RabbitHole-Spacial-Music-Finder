const API_ROOT = "http://ws.audioscrobbler.com/2.0/";

//calls any last.fm method with the given parameters and returns the response as JSON
async function callLastfm(method, params){
    const url = new URL(API_ROOT);
    url.searchParams.set("method", mehod);
    url.searchParams.set("api_key", process.env.LASTFM_API_KEY);
    url.searchParams.set("format", "json");

    //copy every entry of params into url.searchParams
    for(const [key, value] of Object.entries(params)){
        url.searchParams.set(key, value);
    }




}