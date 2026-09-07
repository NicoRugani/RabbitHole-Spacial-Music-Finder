
//loads styles and starts react inside id="root" in index.html

//imports reacts dev-checking component
import { StrictMode } from 'react';
//imports function that connect react to an element in the browser 
import { createRoot } from 'react-dom/client';
// import react flow and styles
import '@xyflow/react/dist/style.css';
import './styles.css';

// load the main app 
import App from './App.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
