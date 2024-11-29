import React, { useState } from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';

const BotSubmission = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prefix, setPrefix] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const createBotMutation = useMutation(
    (botData) => apiService.createBot(botData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bots']);
        setName('');
        setDescription('');
        setPrefix('');
        setGithubUrl('');
        setWebsiteUrl('');
        setImageUrl('');
        setImage(null);
        setError('');
        setLoading(false);
      },
      onError: (err) => {
        setLoading(false);
        setError(err.response.data.message || 'Failed to create bot');
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

    await createBotMutation.mutate(formData);
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Submit Your Bot</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Bot Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          fullWidth
          required
        />
        <TextField
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          fullWidth
          required
        />
        <TextField
          label="Prefix"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          margin="normal"
          fullWidth
          required
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
        <Button type="submit" variant="contained" color="primary">
          Submit Bot
        </Button>
      </form>
    </Box>
  );
};

export default BotSubmission;
```