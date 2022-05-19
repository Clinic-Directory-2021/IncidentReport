import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/registrar';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import IncidentsReports from './pages/IncidentsReports';
import Dashboard from './pages/DashboardApp';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Evaluators from './pages/Evaluators';
import Report from './pages/Report';
import IndividualReport from './pages/IndividualReport';
import Student from './pages/Student';
import Profile from './pages/Profile';
import Settings from './pages/Settings'


// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/registrar',
      element: <DashboardLayout />,
      children: [
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'evaluators', element: <Evaluators/> },
        { path: 'student', element: <Student/> },
        { path: 'incidentsReports', element: <IncidentsReports /> },
        { path: 'report', element: <Report /> },
        
      ],
    },
    {
      path: '/student',
      element: <DashboardLayout />,
      children: [
        { path: 'incidentsReports', element: <IncidentsReports /> },
        { path: 'report', element: <Report /> }, 
        { path: 'profile', element: <Profile /> },  
        { path: 'settings', element: <Settings/> },  
       
        
      ],
    },
    {
      path: '/evaluator',
      element: <DashboardLayout />,
      children: [
        { path: 'incidentsReports', element: <IncidentsReports /> },
        { path: 'report', element: <Report /> },  
            
      ],
    },
    {
      path: '/IR',
      element: <DashboardLayout />,
      children: [
        { path: 'IndividualReport', element: <IndividualReport /> },   
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
