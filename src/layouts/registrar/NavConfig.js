// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/registrar/dashboard',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Evaluators',
    path: '/registrar/evaluators',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'Incidents Reports',
    path: '/registrar/incidentsReports',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'Report',
    path: '/registrar/report',
    icon: getIcon('eva:alert-triangle-fill'),
  },
];

export default navConfig;
