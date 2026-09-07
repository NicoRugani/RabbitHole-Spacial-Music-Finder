import {songs} from "./songs.js";

console.log(songs);
console.log("Song 1 Title:", songs[0].title);
console.log("Song 2 Artist:", songs[1].artist);


const songTitles = songs.map(song => song.title);
console.log("All Song Titles:", songTitles);

const popSongs = songs.filter(song => song.genre === "Pop");
console.log("Pop Songs:", popSongs);
const popSongTitles = popSongs.map(song => song.title);
console.log("Pop Song Titles:", popSongTitles);

const {title, artist} = songs[2];
console.log(`Song 3: ${title} by ${artist}`);


const describeSong = ({title, artist, album, genre, year}) => {
    return `${title} by ${artist} from the album ${album} (${year}) - Genre: ${genre}`;
};

console.log(describeSong(songs[0]));


// create favotieSong by copying songs[0] with spread and adding isFavorite: true
const favoriteSong = {...songs[0], isFavorite: true};
console.log("Favorite Song:", favoriteSong);
console.log("Is Favorite:", favoriteSong.isFavorite);
console.log("Original Song 1 isFavorite:", songs[0].isFavorite); // should be undefined


const updatedSongs = songs.map(song => {
    if (song.id === 2) {
        return {...song, isFavorite: true};
    }
    else{ return song; }
});

console.log("Updated Song:",  updatedSongs[1]);
console.log("original song:", songs[1]);


//selects song list element
const songList = document.querySelector("#song-list");




const renderSongs = (songsToRender) => {
    songList.textContent = "";

    songsToRender.forEach(song => {
        const item = document.createElement("li");
        item.textContent = describeSong(song);
        songList.appendChild(item);
    })
}

renderSongs(songs);



const filterInput = document.querySelector("#genre-filter");

filterInput.addEventListener("change", (event) => {
    const selectedGenre = event.target.value;
    if (selectedGenre === "all") {
        renderSongs(songs);
    } else{
       // render only the songs that match the selected genre
       const filteredSongs = songs.filter(song => song.genre === selectedGenre);
       renderSongs(filteredSongs);
        
        
    }
});
