# RabbitHole

A music discovery app built around an interactive graph. The current foundation displays one placeholder song with dragging, panning, zooming, and a **Fit Web** control.

## Run locally

Install Node.js compatible with Vite, then run from this repository:

```sh
npm install
npm run dev
```

Open the local address printed in the terminal. 

```sh
npm run build
npm run preview
```

These commands build the production files into `dist/` and preview that build locally.

## How this version works

- `src/main.jsx` mounts React into the root element in `index.html`.
- `src/App.jsx` wraps the first song in a React Flow node with an ID, position, and data. `SongNode` renders that data as a card; `useNodesState` tracks changes such as dragging.
- `src/styles.css` styles the graph and song card.
- `Project_Files/`  The graph imports the original `songs.js` data from there.

React manages what appears on screen. React Flow supplies the interactive graph surface. Vite runs the development server and creates the production build.

## Next milestone

Select a song, see three sample candidates, and use **Add to Path** to add a connected song. Then select an earlier node and branch again. Recommendations, audio, real search, and persistence are not implemented yet; the graph resets on reload.

References: [React Flow quick start](https://reactflow.dev/learn) and [Vite guide](https://vite.dev/guide/).
