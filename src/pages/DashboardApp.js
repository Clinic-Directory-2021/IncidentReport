
import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import { firestore } from 'src/firebase/firebase-config';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Button from '@mui/material/Button';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';
import { useReactToPrint } from "react-to-print";
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
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
]

export default function DashboardApp() {
  
  const theme = useTheme();
  const [users, setUser] = useState(0)
  const [evaluators, setEvaluators] = useState(0)
  const [incidentReports, setIncidentReports] = useState(0)
  const [total, setTotal] = useState(0)

  const[userData, setUserData] = useState([])
  const[evaluatorData, setEvaluatorData] = useState([])
  const[incidentData, setIncidentData] = useState([])
  const[totalData, setTotalData] = useState([])
  const[currentDate, setCurrentDate] = useState(new Date())

  const getUsers = () =>{
    const q = query(collection(firestore, "users"),  where('userType', '==', 'Student'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let temp = 0;
      const  temp2 = []
      querySnapshot.forEach((doc) => {
          temp += 1
          temp2.push(doc.data())
      });
      setUser(temp)
      setUserData(temp2)
    });
  }

  const getEval = () =>{
    const q = query(collection(firestore, "users"), where('userType', '==', 'Evaluator' ));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let temp = 0;
      const  temp2 = []
      querySnapshot.forEach((doc) => {
          temp += 1
          temp2.push(doc.data())
      });
      setEvaluators(temp)
      setEvaluatorData(temp2)
    });
  }

  const getInci = () =>{
    const q = query(collection(firestore, "incidents"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let temp = 0;
      const  temp2 = []
      querySnapshot.forEach((doc) => {
          temp += 1
          temp2.push(doc.data())
      });
      setIncidentReports(temp)
      setIncidentData(temp2)
    });
  }

  const getTotal = () =>{
    const q = query(collection(firestore, "incidents"), where('status', '==', 'close'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let temp = 0;
      const  temp2 = []
      querySnapshot.forEach((doc) => {
          temp += 1
          temp2.push(doc.data())
      });
      setTotal(temp)
      setTotalData(temp2)
    });
  }

  useEffect(() => {
    getUsers()
    getEval()
    getInci()
    getTotal()
  }, [])
  
  const userRef = React.useRef();
  const handleUser = useReactToPrint({
    content: () => userRef.current,
  });

  const evalRef = React.useRef();
  const handleEval = useReactToPrint({
    content: () => evalRef.current,
  });

  const incidentRef = React.useRef();
  const handleIncident = useReactToPrint({
    content: () => incidentRef.current,
  });

  const totalRef = React.useRef();
  const handleTotals = useReactToPrint({
    content: () => totalRef.current,
  });
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Students" total={users} icon={'ant-design:user'} />
            <Button variant="outlined" sx={{marginTop:5}} onClick={handleUser}>Print users</Button>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Evaluators" total={evaluators} color="info" icon={'ant-design:usergroup-add'} />
            <Button variant="outlined" sx={{marginTop:5}} onClick={handleEval}>Print evaluators</Button>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Incident Reports" total={incidentReports} color="warning" icon={'ant-design:file'} />
            <Button variant="outlined" sx={{marginTop:5}} onClick={handleIncident}>Print incidents</Button>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Reports/Total of Closed Incident" total={total} color="error" icon={'ant-design:printer'} />
            <Button variant="outlined" sx={{marginTop:5}} onClick={handleTotals}>Print total</Button>
          </Grid>
        </Grid>
      </Container>

      <Box 
      sx={{display:'none'}}
      >
        <TableContainer component={Paper} ref={userRef} style={{padding:10}}>
        
        <Typography sx={{marginLeft:1}}>
        <h1 align='center'>User list</h1>
         <text style={{fontSize:12}}>Date Printed: {currentDate.getMonth() + 1}/{currentDate.getDate()}/{currentDate.getFullYear()}</text>
        </Typography>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>First name</TableCell>
              <TableCell align="right">Middle name</TableCell>
              <TableCell align="right">Last name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Year</TableCell>
              <TableCell align="right">Section</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.firstName}
                </TableCell>
                <TableCell align="right">{row.middleName}</TableCell>
                <TableCell align="right">{row.lastName}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">{row.yearLevel}</TableCell>
                <TableCell align="right">{row.section}</TableCell>
             </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

      {/* evaluator */}
      <Box 
      sx={{display:'none'}}
      >
        <TableContainer component={Paper} ref={evalRef} style={{padding:10}}>
        <Typography sx={{marginLeft:1}}>
        <h1 align='center'>Evaluators list</h1>
        <text style={{fontSize:12}}>Date Printed: {currentDate.getMonth() + 1}/{currentDate.getDate()}/{currentDate.getFullYear()}</text>
        </Typography>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>First name</TableCell>
              <TableCell align="right">Last name</TableCell>
              <TableCell align="right">Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evaluatorData.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.firstName}
                </TableCell>
                <TableCell align="right">{row.lastName}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
             </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

    {/* Incident */}

      <Box 
      sx={{display:'none'}}
      >
        <TableContainer component={Paper} ref={incidentRef} style={{padding:10}}>
        <Typography sx={{marginLeft:1}}>
        <h1 align='center'>Incident list</h1>
        <text style={{fontSize:12}}>Date Printed: {currentDate.getMonth() + 1}/{currentDate.getDate()}/{currentDate.getFullYear()}</text>
        </Typography>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Student number</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Incident Type</TableCell>
              <TableCell align="right">Section</TableCell>
              <TableCell align="right">Year Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidentData.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.studentNumber}
                </TableCell>
                <TableCell align="right">{row.studentName}</TableCell>
                <TableCell align="right">{row.incidentType}</TableCell>
                <TableCell align="right">{row.section}</TableCell>
                <TableCell align="right">{row.year}</TableCell>
             </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

       {/* total */}

       <Box 
      sx={{display:'none'}}
      >
        <TableContainer component={Paper} ref={totalRef} style={{padding:10}}>
        <Typography sx={{marginLeft:1}}>
        <h1 align='center'>Total close incident list</h1>
        <text style={{fontSize:12}}>Date Printed: {currentDate.getMonth() + 1}/{currentDate.getDate()}/{currentDate.getFullYear()}</text>
        </Typography>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Student number</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Incident Type</TableCell>
              <TableCell align="right">Section</TableCell>
              <TableCell align="right">Year Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totalData.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.studentNumber}
                </TableCell>
                <TableCell align="right">{row.studentName}</TableCell>
                <TableCell align="right">{row.incidentType}</TableCell>
                <TableCell align="right">{row.section}</TableCell>
                <TableCell align="right">{row.year}</TableCell>
             </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

    </Page>
  );
}
