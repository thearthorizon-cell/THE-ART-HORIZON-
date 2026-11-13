import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { testFirestoreConnection } from './firebase.ts';

void testFirestoreConnection();

createRoot(document.getElementById('root')!).render(<App />);
