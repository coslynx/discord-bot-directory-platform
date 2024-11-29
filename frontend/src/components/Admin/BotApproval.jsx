import  as React from 'react';
import { Box, Grid, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Button, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';

const BotApproval = () => {
  const queryClient = useQueryClient();
  const [selectedBot, setSelectedBot] = useState(null);

  const { data: pendingBots, isLoading, isError, error } = useQuery({
    queryKey: ['bots', 'pending'],
    queryFn: () => apiService.getBots('', 'pending'),
  });

  const approveBotMutation = useMutation(
    (botId) => apiService.approveBot(botId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bots', 'pending']);
        setSelectedBot(null);
      },
    }
  );

  const rejectBotMutation = useMutation(
    (botId) => apiService.rejectBot(botId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bots', 'pending']);
        setSelectedBot(null);
      },
    }
  );

  const handleApprove = (bot) => {
    approveBotMutation.mutate(bot.id);
  };

  const handleReject = (bot) => {
    rejectBotMutation.mutate(bot.id);
  };

  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Bot Approval</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bot Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingBots.map((bot) => (
              <TableRow key={bot.id}>
                <TableCell>{bot.name}</TableCell>
                <TableCell>{bot.description}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleApprove(bot)}>Approve</Button>
                  <Button variant="contained" color="secondary" onClick={() => handleReject(bot)}>Reject</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BotApproval;
```