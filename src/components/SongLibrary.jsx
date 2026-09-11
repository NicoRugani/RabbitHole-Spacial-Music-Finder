export default function SongLibrary({
    nodes, 
    selectedSongId, 
    onSelect,
    disabled,   
}){
    return (

       
        <aside className = "song-info">
            <h2>Library</h2>
            <ul className = "song-library-list">
                { nodes.length === 0 ? (
                    <li>No songs in library</li>
                ) : (
                    nodes.map(node => (
                        <li key = {node.id}>
                            <button
                                disabled = {disabled}
                                aria-current = {
                                    node.data.id === selectedSongId ? "true" : undefined
                                }
                                onClick = {() => onSelect(node.id)}
                            >
                                {node.data.title} by {node.data.artist}
                            </button>
                        </li>
                    ))
                )}
            </ul>      
        </aside> 
    );

}
