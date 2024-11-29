import React from 'react';
import { Box, Grid } from '@mui/material';
import AdminDashboard from '../components/Admin/AdminDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const Admin = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AdminDashboard />
          </Grid>
        </Grid>
      </Box>
    </QueryClientProvider>
  );
};

export default Admin;
```