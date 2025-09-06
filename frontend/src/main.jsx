import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ErrorPage from './components/ErrorPage/ErrorPage.jsx';
import Weekly from './components/Weekly/Weekly'
import Gallery from './components/Gallery/Gallery'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "gallery", element: <Gallery /> },
      { path: "calendar", element: <Weekly /> },
      { index: true, element: <Weekly /> },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
