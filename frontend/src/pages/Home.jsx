import React from 'react';
import { Box, Grid, Typography, Container } from '@mui/material';
import BotListing from '../components/User/BotListing';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';

const Home = () => {
  const { data: approvedBots, isLoading, isError, error } = useQuery(
    ['bots', 'approved'],
    () => apiService.getBots('', 'approved')
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <Box>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom>
          Featured Discord Bots
        </Typography>
        <Grid container spacing={3}>
          {approvedBots.map((bot) => (
            <Grid item xs={12} sm={6} md={4} key={bot.id}>
              <BotListing botId={bot.id} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
```