import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// 리액트 쿼리를 사용하기 위함!
const queryClient = new QueryClient();

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
