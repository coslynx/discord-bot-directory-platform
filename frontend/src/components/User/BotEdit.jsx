import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';

const BotEdit = ({ botId }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prefix, setPrefix] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: bot, isLoading: isBotLoading, isError: isBotError, error: botError } = useQuery(['bot', botId], () => apiService.getBot(botId),{enabled: !!botId});

  useEffect(() => {
    if (bot) {
      setName(bot.name);
      setDescription(bot.description);
      setPrefix(bot.prefix);
      setGithubUrl(bot.githubUrl);
      setWebsiteUrl(bot.websiteUrl);
      setImageUrl(bot.imageUrl);
      setStatus(bot.status);
    }
  }, [bot]);

  const updateBotMutation = useMutation(
    (botData) => apiService.updateBot(botId, botData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bots']);
        setLoading(false);
        setError('');
      },
      onError: (err) => {
        setLoading(false);
        setError(err.response.data.message || 'Failed to update bot');
      },
    }
  );

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('prefix', prefix);
    formData.append('githubUrl', githubUrl);
    formData.append('websiteUrl', websiteUrl);
    if (image) {
      formData.append('image', image);
    }
    formData.append('status', status);


    await updateBotMutation.mutate(formData);
  };

  if (isBotLoading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  }

  if (isBotError) {
    return <Typography>Error: {botError.message}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Edit Bot</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Bot Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Prefix"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="GitHub URL"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Website URL"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          margin="normal"
          fullWidth
        />
        <input type="file" accept="image/" onChange={handleImageChange} />
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Bot'}
        </Button>
      </form>
    </Box>
  );
};

export default BotEdit;
```