
// loads tools and prepairs the first songs graph data for react flow to render.
import {
  Background,
  Controls,
  Panel,
  ReactFlow,
  // functions
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { songs } from '../Project_Files/songs.js';

// React Flow adds a position and graph identity around our existing song data.
const initialNodes = [
  {
    id: String(songs[0].id),
    type: 'song',
    position: { x: 0, y: 0 },
    data: songs[0],
  },
];

function SongNode({ data }) {
  return (
    <article className="song-node">
      <span className="song-genre">{data.genre}</span>
      <h2>{data.title}</h2>
      <p>{data.artist}</p>
      <p className="song-album">{data.album} · {data.year}</p>
    </article>
  );
}

// Keep this mapping outside App so its identity stays stable between renders.
// creates an object
// song is the property name, SongNode is the function stored and its value. React Flow will use this mapping to render the correct node type.
const nodeTypes = { song: SongNode };
const fitViewOptions = { padding: 0.4, maxZoom: 1 };


// FitWebButton is a button that when clicked, will fit the entire graph into the view.
function FitWebButton() {
  const { fitView } = useReactFlow();

  return (
    <button
      className="fit-web"
      onClick={() => fitView({ ...fitViewOptions, duration: 350 })}
    >
      Fit Web
    </button>
  );
}

// App is the main component that renders the entire application. 
export default function App() {
  // onNodesChange keeps React's node data in sync when a node is dragged.
  const [nodes, , onNodesChange] = useNodesState(initialNodes);

  return (
    <main className="app">
      <header className="app-header">
        <h1>RabbitHole<span> / music map</span></h1>
        <span className="demo-label">Sample songs</span>
      </header>
      // 
      <section className="graph" aria-label="Interactive music map">
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          nodesConnectable={false}
          deleteKeyCode={null}
          minZoom={0.2}
          maxZoom={2}
          fitView
          fitViewOptions={fitViewOptions}
          colorMode="dark"
        >
          <Background color="#34445f" gap={28} size={1} />
          <Controls showInteractive={false} showFitView={false} />
          <Panel position="top-right"><FitWebButton /></Panel>
          <Panel position="bottom-center" className="map-hint">
            Drag the map to explore · Scroll to zoom · Drag a song to move it
          </Panel>
        </ReactFlow>
      </section>
    </main>
  );
}
