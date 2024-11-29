import React, { useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import BotApproval from './BotApproval';
import BotModeration from './BotModeration';
import UserManagement from './UserManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import { useQueryClient } from '@tanstack/react-query';

const AdminDashboard = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // You might want to prefetch data here if needed.  This depends on your API and data fetching strategy.
    // Example:  queryClient.prefetchQuery(['bots']);
  }, [queryClient]);

  return (
    <Box>
      <Typography variant="h3" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <BotApproval />
        </Grid>
        <Grid item xs={12} md={6}>
          <BotModeration />
        </Grid>
        <Grid item xs={12} md={6}>
          <UserManagement />
        </Grid>
        <Grid item xs={12} md={6}>
          <AnalyticsDashboard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
```