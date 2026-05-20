import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { SiteContext, parseSiteIdFromUrl } from './contexts/SiteContext.tsx';
import './index.css';

const siteId = parseSiteIdFromUrl();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <SiteContext.Provider value={{ siteId }}>
        <App />
      </SiteContext.Provider>
    </ErrorBoundary>
  </StrictMode>,
);
