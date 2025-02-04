import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/styles/main.scss';
import App from './App';
import { init as initFullStory } from '@fullstory/browser';
import { FS_ORG_ID } from './config/AppConfig';

console.log('FS_ORG_ID', FS_ORG_ID)
console.log('FS_ORG_ID', JSON.parse(FS_ORG_ID))

initFullStory({ orgId: FS_ORG_ID });

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
