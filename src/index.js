import React from 'react';
import Landing from './pages/landingpage';
import { persistQueryClient } from "@tanstack/react-query-persist-client"
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


import { ToastProvider } from 'react-toast-notifications';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './index.css';



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const localStoragePersistor = createSyncStoragePersister({ 
  storage: window.localStorage ,
})

persistQueryClient({
  queryClient,
  persister: localStoragePersistor,
})

let LazyApp = React.lazy(()=>import("./App"))
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}> 
      <ToastProvider  placement="top-right" >
        <React.Suspense fallback={<Landing />}>
          <LazyApp />
        </React.Suspense>
      </ToastProvider>
      </QueryClientProvider>
   
    </React.StrictMode>
  
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
