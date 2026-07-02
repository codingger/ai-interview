import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter,RouterProvider } from 'react-router';
import './index.css'
import App from './App.jsx'
import Login from "./Login.jsx";
import Dashboard from './Dashboard.jsx';
import Application from './ApplicationForm.jsx';
import Interview from './interview_page.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children:[
      {
        path:"",
        element:<h1>welome to the job tracker app.</h1>,
      },
      {
        path:"job-application",
        element:<Application/>,
      },
      {
        path:"ai-interview",
        element:<Interview/>,
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
