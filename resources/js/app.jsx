import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import '../css/app.css';

createInertiaApp({
  resolve: name => {
    if (name === 'Page404') return import('./Pages/Page404.jsx').then(m => m.default)
    return import(`./Pages/${name}.jsx`).then(m => m.default)
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});