import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';
import Chart from 'react-google-charts';


const AnalyticsDashboard = () => {
  const [totalBots, setTotalBots] = useState(0);
  const [approvedBots, setApprovedBots] = useState(0);
  const [pendingBots, setPendingBots] = useState(0);
  const [rejectedBots, setRejectedBots] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);


  const { data: botData, isLoading: botLoading, isError: botError } = useQuery(['bots'], () => apiService.getAllBots());
  const { data: userData, isLoading: userLoading, isError: userError } = useQuery(['users'], () => apiService.getAllUsers());

  useEffect(() => {
    if (botData) {
      setTotalBots(botData.length);
      setApprovedBots(botData.filter(bot => bot.status === 'approved').length);
      setPendingBots(botData.filter(bot => bot.status === 'pending').length);
      setRejectedBots(botData.filter(bot => bot.status === 'rejected').length);
    }
    if (userData) {
      setTotalUsers(userData.length);
    }
  }, [botData, userData]);


  const botStatusData = [
    ['Status', 'Count'],
    ['Approved', approvedBots],
    ['Pending', pendingBots],
    ['Rejected', rejectedBots],
  ];

  const options = {
    title: 'Bot Submission Status',
    pieHole: 0.4,
    is3D: true,
  };


  if (botLoading || userLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (botError || userError) {
    return <Typography>Error loading data</Typography>;
  }


  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Bots
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {totalBots}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Users
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Average Bot Uptime
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {/ Placeholder - needs backend calculation /}
                Calculating...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Chart
                chartType="PieChart"
                data={botStatusData}
                options={options}
                width={"100%"}
                height={"400px"}
              />
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;
```