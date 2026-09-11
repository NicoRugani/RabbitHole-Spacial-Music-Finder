// App supplies eligible songs; this component reports which song was chosen.
export default function Recommendations({ songs, onAddToGraph }) {
  return (
    <aside className="song-info">
      <h2>Recommendations</h2>
      <ul className="recommendations-list">
        {songs.length === 0 ? (
          <li>No recommendations available</li>
        ) : (
          songs.map(song => (
            <li key={song.id}>
              <span>{song.title} by {song.artist} ({song.year})</span>
              <button className="add-to-graph-button" onClick={() => onAddToGraph(song)}>Add to Graph</button>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
