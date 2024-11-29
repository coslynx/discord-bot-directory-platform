import  as React from 'react';
import { Box, Grid, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Button, TextField, IconButton, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const BotModeration = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [editingBot, setEditingBot] = useState(null);
  const [editedBotName, setEditedBotName] = useState('');
  const [editedBotDescription, setEditedBotDescription] = useState('');
  const [editedBotStatus, setEditedBotStatus] = useState('');


  const { data: bots, isLoading, isError, error } = useQuery({
    queryKey: ['bots', searchQuery, selectedStatus],
    queryFn: () => apiService.getBots(searchQuery, selectedStatus),
  });

  const updateBotMutation = useMutation(
    (botData) => apiService.updateBot(botData.id, botData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bots']);
        setEditingBot(null);
        setEditedBotName('');
        setEditedBotDescription('');
        setEditedBotStatus('');
      },
    }
  );

  const deleteBotMutation = useMutation(
    (botId) => apiService.deleteBot(botId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bots']);
      },
    }
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleEditClick = (bot) => {
    setEditingBot(bot);
    setEditedBotName(bot.name);
    setEditedBotDescription(bot.description);
    setEditedBotStatus(bot.status);
  };

  const handleSaveClick = () => {
    if (editingBot) {
      updateBotMutation.mutate({
        id: editingBot.id,
        name: editedBotName,
        description: editedBotDescription,
        status: editedBotStatus,
      });
    }
  };

  const handleCancelClick = () => {
    setEditingBot(null);
    setEditedBotName('');
    setEditedBotDescription('');
    setEditedBotStatus('');
  };

  const handleDeleteClick = (botId) => {
    deleteBotMutation.mutate(botId);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Bot Moderation</Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Search by Bot Name"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>Search</IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Filter by Status</InputLabel>
            <Select value={selectedStatus} onChange={handleStatusChange}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bot Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bots.map((bot) => (
              <TableRow key={bot.id}>
                <TableCell>
                  {editingBot?.id === bot.id ? (
                    <TextField value={editedBotName} onChange={(e) => setEditedBotName(e.target.value)} />
                  ) : (
                    bot.name
                  )}
                </TableCell>
                <TableCell>
                  {editingBot?.id === bot.id ? (
                    <TextField value={editedBotDescription} onChange={(e) => setEditedBotDescription(e.target.value)} />
                  ) : (
                    bot.description
                  )}
                </TableCell>
                <TableCell>
                  {editingBot?.id === bot.id ? (
                    <FormControl fullWidth>
                      <Select value={editedBotStatus} onChange={(e) => setEditedBotStatus(e.target.value)}>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    bot.status
                  )}
                </TableCell>
                <TableCell>
                  {editingBot?.id === bot.id ? (
                    <>
                      <Button variant="contained" color="primary" onClick={handleSaveClick}>Save</Button>
                      <Button onClick={handleCancelClick}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEditClick(bot)}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDeleteClick(bot.id)}><DeleteIcon /></IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BotModeration;
```