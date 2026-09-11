// App supplies the selected song and the actions that update shared state.
export default function SongDetails({ song, onDeselect, onFindRecommendations }) {
  return (
    <aside className="song-info">
      <h2>Selected song</h2>
      {song ? (
        <>
          <p>{song.title}</p>
          <p>{song.artist}</p>
          <p>{song.album} · {song.year}</p>
          <p className="song-genre">{song.genre}</p>
          <div className="song-actions">
            <button className="deselect-button" onClick={onDeselect}>Deselect</button>
            <button className="find-recommendations-button" onClick={onFindRecommendations}>Find Recommendations</button>
          </div>
        </>
      ) : (
        <p>Click a song to view its details</p>
      )}
    </aside>
  );
}
