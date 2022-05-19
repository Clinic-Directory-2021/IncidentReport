// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const admin= [
  {
    title: 'Dashboard',
    path: '/registrar/dashboard',
    icon: getIcon('eva:pie-chart-outline'),
  },
  {
    title: 'Student',
    path: '/registrar/Student',
    icon: getIcon('eva:person-outline'),
  },
  {
    title: 'Evaluators',
    path: '/registrar/evaluators',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Incidents Reports',
    path: '/registrar/incidentsReports',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'Report',
    path: '/registrar/report',
    icon: getIcon('eva:printer-outline'),
  },
];

const evaluator = [
  {
    title: 'Incidents Reports',
    path: '/evaluator/incidentsReports',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'Report',
    path: '/evaluator/report',
    icon: getIcon('eva:printer-outline'),
  },
];

const student = [
  {
    title: 'Incidents Reports',
    path: '/student/incidentsReports',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'Report',
    path: '/student/report',
    icon: getIcon('eva:printer-outline'),
  },
];

export {admin};
export {evaluator};
export {student};
