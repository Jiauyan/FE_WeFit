import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from "./routes/routes";
import { AllProvider } from './contexts/AllProvider';
// import { useAuth } from './hook/UseAuth'; 

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <AllProvider>
      <RouterProvider router={router} />
    </AllProvider>
  </React.StrictMode>
)
