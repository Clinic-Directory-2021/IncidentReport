
import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import { firestore } from 'src/firebase/firebase-config';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();
  const [users, setUser] = useState(0)
  const [evaluators, setEvaluators] = useState(0)
  const [incidentReports, setIncidentReports] = useState(0)
  const [total, setTotal] = useState(0)

  const getUsers = () =>{
    const q = query(collection(firestore, "users"),  where('userType', '==', 'Student'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let temp = 0;
      querySnapshot.forEach((doc) => {
          temp += 1
      });
      setUser(temp)
    });
  }

  const getEval = () =>{
    const q = query(collection(firestore, "users"), where('userType', '==', 'Evaluator' ));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let temp = 0;
      querySnapshot.forEach((doc) => {
          temp += 1
      });
      setEvaluators(temp)
    });
  }

  const getInci = () =>{
    const q = query(collection(firestore, "incidents"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let temp = 0;
      querySnapshot.forEach((doc) => {
          temp += 1
      });
      setIncidentReports(temp)
    });
  }

  const getTotal = () =>{
    const q = query(collection(firestore, "incidents"), where('status', '==', 'close'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let temp = 0;
      querySnapshot.forEach((doc) => {
          temp += 1
      });
      setTotal(temp)
    });
  }

  useEffect(() => {
    getUsers()
    getEval()
    getInci()
    getTotal()
  }, [])
  

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Students" total={users} icon={'ant-design:user'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Evaluators" total={evaluators} color="info" icon={'ant-design:usergroup-add'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Incident Reports" total={incidentReports} color="warning" icon={'ant-design:file'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Reports/Total of Closed Incident" total={total} color="error" icon={'ant-design:printer'} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
