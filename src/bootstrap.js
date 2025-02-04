import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/styles/main.scss';
import App from './App';
import { init as initFullStory } from '@fullstory/browser';
import { FS_ORG_ID } from './config/AppConfig';

initFullStory({ orgId: FS_ORG_ID });

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
