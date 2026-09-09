
//loads styles and starts react inside id="root" in index.html

//imports reacts dev-checking component
import { StrictMode } from 'react';
//imports function that connect react to an element in the browser 
import { createRoot } from 'react-dom/client';
// imports react flow library and its styles, and our own custom styles. 
import '@xyflow/react/dist/style.css';
import './styles.css';

// load the main app 
import App from './App.jsx';

// Finds div in browser wiht id="root" and creates a react root associated with that div. tells react to render App (app.jsx) inside that div. 

// StrictMode is a dev tool that checks for common mistakes in react code.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
